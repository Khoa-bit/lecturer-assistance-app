import Link from "next/link";
import Modal from "../modal/Modal";
import IndexHeaderCell from "../tanstackTable/IndexHeaderCell";
import IndexCellDefault from "../tanstackTable/IndexCellDefault";
import { dateFormat, formatDate } from "../../lib/input_handling";
import React, { useState } from "react";
import type { ListResult } from "pocketbase";
import type { ParticipantsXlsxImportResponse } from "raito/types/endpoints-types";
import type { PBCustom } from "../../types/pb-custom";
import { IcRoundDownload } from "../icons/IcRoundDownload";
import { IcRoundUploadFile } from "../icons/IcRoundUploadFile";

interface ImportParticipantsInputProps {
  docId: string;
  disabled: boolean;
  pbClient: PBCustom;
  addParticipantsCallback: (personIds: string[]) => Promise<boolean>;
}

export function ImportParticipantsInput({
  docId,
  disabled,
  pbClient,
  addParticipantsCallback,
}: ImportParticipantsInputProps) {
  const [isOpenImportPreviewModal, setIsOpenImportPreviewModal] =
    useState(false);
  const [previewData, setPreviewData] =
    useState<ListResult<ParticipantsXlsxImportResponse>>();
  const [importFormData, setImportFormData] = useState<FormData>();

  return (
    <>
      <div className="w-fulll flex gap-2 py-2">
        <label
          htmlFor="xlsxImportFile"
          className={`rounded-btn flex h-12 flex-grow items-center gap-1 border border-gray-300 px-2 font-semibold hover:bg-gray-50 ${
            !disabled ? "cursor-pointer" : "bg-gray-50 text-gray-500"
          }`}
        >
          <IcRoundUploadFile className="h-6 w-6 text-gray-500"></IcRoundUploadFile>
          <span>Import participants</span>
        </label>
        <input
          id="xlsxImportFile"
          className="hidden"
          type="file"
          onChange={async (e) => {
            const xlsxImportFile = e.currentTarget.files?.item(0);

            if (xlsxImportFile === null || xlsxImportFile === undefined) return;

            const formData = new FormData();
            setImportFormData(formData);
            formData.append("xlsxImportFile", xlsxImportFile);

            await pbClient
              .send(`/api/user/importParticipants/${docId}`, {
                method: "POST",
                body: formData,
                params: {
                  isDryRun: true,
                },
              })
              .then((response: ListResult<ParticipantsXlsxImportResponse>) => {
                // set preview data
                setPreviewData(response);

                // open preview modal
                setIsOpenImportPreviewModal(true);
              })
              .catch((err) => console.error(err));
          }}
          disabled={disabled}
        />
        <Link
          download={true}
          href={"/student_import_template.xlsx"}
          className="rounded-btn flex w-fit cursor-pointer items-center gap-1 border border-gray-300 p-1 pr-1.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
        >
          <IcRoundDownload className="h-6 w-6"></IcRoundDownload>
          Get template
        </Link>
      </div>
      <Modal
        id="ImportPopUp"
        isOpen={isOpenImportPreviewModal}
        setIsOpen={setIsOpenImportPreviewModal}
        title="Import preview"
      >
        <div className="max-w-5xl overflow-x-auto p-1">
          <table className="min-w-full">
            <thead className="border-b text-left">
              <tr>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[3rem]">No</IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[9rem]">
                    StudentID
                  </IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[11rem]">
                    LastName
                  </IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[7rem]">
                    FirstName
                  </IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[8rem]">
                    DOB
                  </IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[7rem]">
                    Gender
                  </IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[7rem]">
                    MajorID
                  </IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[11rem]">
                    Major
                  </IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[7rem]">
                    DepartmentID
                  </IndexHeaderCell>
                </th>
                <th className="h-full">
                  <IndexHeaderCell className="min-w-[9rem]">
                    Class
                  </IndexHeaderCell>
                </th>
              </tr>
            </thead>
            <tbody>
              {previewData?.items.map((value, index) => (
                <tr
                  key={!value.ID ? `${value.StudentID}-${index}` : value.ID}
                  className={`h-11 odd:bg-white even:bg-slate-100 hover:bg-slate-200 ${
                    value.Exists && "border border-yellow-500"
                  }`}
                  title={`${value.LastName} ${value.FirstName} - Pending ${
                    value.Exists ? "Update" : "Create"
                  }`}
                >
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[3rem]">
                      {value.No}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[9rem]">
                      {value.StudentID}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[11rem]">
                      {value.LastName}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[7rem]">
                      {value.FirstName}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[8rem]">
                      {formatDate(value.DOB, dateFormat)}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[7rem]">
                      {value.Gender}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[7rem]">
                      {value.MajorID}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[11rem]">
                      {value.Major}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[7rem]">
                      {value.DepartmentID}
                    </IndexCellDefault>
                  </td>
                  <td className="h-full">
                    <IndexCellDefault className="min-w-[9rem]">
                      {value.Class}
                    </IndexCellDefault>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex w-full">
          {importFormData && (
            <button
              className="ml-auto mr-2 mt-3 rounded bg-green-100 px-2 py-1 font-semibold text-green-700 transition-colors hover:border-transparent hover:bg-green-500 hover:text-green-50"
              onClick={async () => {
                await pbClient
                  .send(`/api/user/importParticipants/${docId}`, {
                    method: "POST",
                    body: importFormData,
                    params: {
                      isDryRun: false,
                    },
                  })
                  .then(
                    (response: ListResult<ParticipantsXlsxImportResponse>) => {
                      setPreviewData(response);
                      setIsOpenImportPreviewModal(false);
                      addParticipantsCallback(
                        response.items.map(
                          (newDocParticipant) => newDocParticipant.ID
                        )
                      );
                    }
                  )
                  .catch((err) => console.error(err));
              }}
            >
              Confirm import
            </button>
          )}
        </div>
      </Modal>
    </>
  );
}
