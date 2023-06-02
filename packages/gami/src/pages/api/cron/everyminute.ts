import type { NextApiHandler } from "next";
import type {
  EventDocumentsRecord,
  ParticipantsCustomResponse,
  RemindersResponse,
} from "raito";
import { Collections } from "raito";
import { getPBServer } from "../../../lib/pb_server";
import { dateTimeFormat, formatDate } from "../../../lib/input_handling";
import fs from "fs";
import { getStatusFileName } from "../../../components/documents/Status";
import { env } from "../../../env/server.mjs";
import mjml2html from "mjml";
import { sendMailAsync } from "../../../lib/nodemail_helpers";

export interface InvitationRequestBody {
  docId: string;
  participant: ParticipantsCustomResponse;
}

export interface InvitationResponse {
  message: string;
  responseBody: string[];
}

const handler: NextApiHandler<InvitationResponse> = async (req, res) => {
  if (req.method === "GET") {
    const { pbServer, user } = await getPBServer(
      req,
      req.url ?? "api/cron/everyminute"
    );

    if (user.collectionName !== "services") {
      res.status(400).json({
        message: `Only "services" users collection can access this API: "${user.id}" - "${user.collectionName}"`,
        responseBody: [],
      });
      return;
    }

    const reminders = await pbServer
      .collection(Collections.Reminders)
      .getFullList<RemindersResponse>();

    const logs: string[] = [];
    for (const reminder of reminders) {
      const emails = (
        reminder.allParticipantsEmails as string | undefined
      )?.replace(", ", "");

      if (!emails) {
        console.error(
          "No email addresses for the event:",
          reminder.id,
          reminder.fullDocument_document_name
        );
        continue;
      }

      const mjmlTemplate = fs.readFileSync("src/mjml/reminder.mjml", "utf-8");

      const documentOwner = reminder.fullDocument_document_owner_name;
      const documentName = reminder.fullDocument_document_name;
      const documentType = reminder.fullDocument_internal ?? "Document / Event";
      const logo = "cid:logo";
      const description = reminder.fullDocument_document_description;
      const startTime = formatDate(
        reminder.fullDocument_document_startTime,
        dateTimeFormat
      );
      const endTime = formatDate(
        reminder.fullDocument_document_endTime,
        dateTimeFormat
      );
      const status = "cid:status";
      const statusFileName = getStatusFileName(
        reminder.fullDocument_document_status
      );
      const statusAlt = reminder.fullDocument_document_status;
      const toDocumentNameLink = `${env.GAMI_URL}/fullDocuments/${reminder.toFullDocument_id}`;
      const toDocumentName = reminder.toFullDocument_document_name;
      const priority = reminder.fullDocument_document_priority;
      const invitationLink = `${env.GAMI_URL}/fullDocuments/${reminder.fullDocument_id}`;

      const mjmlContent = mjmlTemplate
        .replace("{{logo}}", logo)
        .replace("{{documentName}}", documentName)
        .replace("{{documentType}}", documentType)
        .replace("{{owner}}", documentOwner)
        .replace("{{description}}", description)
        .replace("{{startTime}}", startTime ?? "Unspecified")
        .replace("{{endTime}}", endTime ?? "Present")
        .replace("{{status}}", status)
        .replace("{{toDocumentNameLink}}", toDocumentNameLink)
        .replace("{{toDocumentName}}", toDocumentName)
        .replace("{{statusAlt}}", statusAlt)
        .replace("{{priority}}", priority)
        .replace("{{invitationLink}}", invitationLink);

      const htmlContent = mjml2html(mjmlContent, {
        keepComments: false,
      }).html;

      fs.writeFileSync("src/mjml/reminderEmail.html", htmlContent, "utf-8");

      // Set up SMTP connection
      const message = await sendMailAsync({
        from: env.EMAIL_USER,
        to: emails,
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

      await pbServer
        .collection(Collections.EventDocuments)
        .update(reminder.id, { reminderAt: "" } as EventDocumentsRecord);

      logs.push(`${message}: '${emails}'`);
    }

    res.status(200).json({
      message: "Reminders sent successfully",
      responseBody: logs,
    });
    return;
  }

  res.status(400).json({ message: "Not a GET request", responseBody: [] });
  return;
};

export default handler;
