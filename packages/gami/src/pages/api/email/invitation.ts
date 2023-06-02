import type { NextApiHandler } from "next";
import * as fs from "fs";
import type {
  DocumentsResponse,
  FullDocumentsResponse,
  ParticipantsCustomResponse,
  PeopleResponse,
} from "raito";
import { Collections } from "raito";
import SuperJSON from "superjson";
import { getPBServer } from "../../../lib/pb_server";
import { env } from "../../../env/server.mjs";
import mjml2html from "mjml";
import {
  dateTimeFormat,
  formatDate,
  zodEmailValidator,
} from "../../../lib/input_handling";
import { sendMailAsync } from "../../../lib/nodemail_helpers";
import { getStatusFileName } from "../../../components/documents/Status";

interface DocumentsExpand {
  "fullDocuments(document)": FullDocumentsResponse;
  owner: PeopleResponse;
}

export interface InvitationRequestBody {
  docId: string;
  participant: ParticipantsCustomResponse;
}

export interface InvitationResponse {
  message: string;
}

const handler: NextApiHandler<InvitationResponse> = async (req, res) => {
  if (req.method === "POST") {
    const toEmail = zodEmailValidator.safeParse(req.query.toEmail);
    if (!toEmail.success) {
      res.status(400).json({
        message: `Invalid recipient email address: "${req.query.toEmail}"`,
      });
      return;
    }

    const { pbServer } = await getPBServer(
      req,
      req.url ?? "api/email/invitation"
    );
    const invitationRequestBody = SuperJSON.parse<InvitationRequestBody>(
      req.body
    );

    const baseDocument = await pbServer
      .collection(Collections.Documents)
      .getOne<DocumentsResponse<DocumentsExpand>>(invitationRequestBody.docId, {
        expand: "fullDocuments(document),owner",
      });

    const mjmlTemplate = fs.readFileSync("src/mjml/invitation.mjml", "utf-8");

    const documentOwner = baseDocument.expand?.owner.name ?? "Anonymous";
    const documentName = baseDocument.name;
    const documentType =
      baseDocument.expand?.["fullDocuments(document)"].internal ??
      "Document / Event";
    const logo = "cid:logo";
    const description = baseDocument.description;
    const startTime = formatDate(baseDocument.startTime, dateTimeFormat);
    const endTime = formatDate(baseDocument.endTime, dateTimeFormat);
    const status = "cid:status";
    const statusFileName = getStatusFileName(baseDocument.status);
    const statusAlt = baseDocument.status;
    const priority = baseDocument.priority;
    const invitationLink = `${env.GAMI_URL}/fullDocuments/${baseDocument.expand?.["fullDocuments(document)"].id}`;

    const mjmlContent = mjmlTemplate
      .replace("{{logo}}", logo)
      .replace("{{documentName}}", documentName)
      .replace("{{documentType}}", documentType)
      .replace("{{owner}}", documentOwner)
      .replace("{{description}}", description)
      .replace("{{startTime}}", startTime ?? "Unspecified")
      .replace("{{endTime}}", endTime ?? "Present")
      .replace("{{status}}", status)
      .replace("{{statusAlt}}", statusAlt)
      .replace("{{priority}}", priority)
      .replace("{{invitationLink}}", invitationLink);

    const htmlContent = mjml2html(mjmlContent, {
      keepComments: false,
    }).html;

    // Set up SMTP connection
    const message = await sendMailAsync({
      from: env.EMAIL_USER,
      to: toEmail.data,
      subject: `Invitation to ${documentName} ${documentType} of ${documentOwner}`,
      html: htmlContent,
      attachments: [
        {
          filename: "IUIconFavicon.png",
          path: "public/IUIconFavicon.png",
          cid: "logo",
        },
        {
          filename: statusFileName,
          path: `public/screenshots/${statusFileName}`,
          cid: "status",
        },
      ],
    });

    res.status(200).json({ message: `${message}: ${toEmail.data}` });
    return;
  }

  res.status(400).json({ message: "Not a POST request" });
  return;
};

export default handler;
