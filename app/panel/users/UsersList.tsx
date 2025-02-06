"use client";

import UserForm from "@/app/components/forms/UserForm";
import Modal from "@/app/components/Modal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import Toast from "@/app/components/Toast";
import useModalType from "@/hooks/useModalType";
import useSelectedItem from "@/hooks/useSelectedItem";
import useSuccess from "@/hooks/useSuccess";
import { noAvatar } from "@/public/images";
import { Image, userRole } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import NextImage from "next/image";

type UserItem = {
  image: Image | null;
  _count: {
    Post: number;
  };
} & {
  name: string;
  role: userRole;
  id: number;
  email: string;
  emailVerified: Date | null;
};

interface Props {
  users: UserItem[];
  usersCount: number;
}

const UsersList = ({ users, usersCount }: Props) => {
  const pageSize = 10;

  // SESSION
  const role = useSession().data?.user.role;

  // HOOKS
  const { modalType, setModalType } = useModalType();
  const { success, setSuccess } = useSuccess();
  const { selectedItem, setSelectedItem } = useSelectedItem<UserItem>();

  // TABLE (COLUMNS)
  const columns = [
    { key: "user", label: "User", className: "w-3/6" },
    {
      key: "posts",
      label: "Post Count",
      className: "hidden lg:table-cell w-2/6",
    },
    {
      key: "rolse",
      label: "Role",
      className: "hidden lg:table-cell w-2/6",
    },
    { key: "email", label: "Email", className: "hidden md:table-cell w-2/6" },
  ];

  if (role === "ADMIN")
    columns.push({
      key: "actions",
      label: "Actions",
      className: "w-1/6 text-right",
    });

  // TABLE (ROWS)
  const renderRows = (user: UserItem) => {
    return (
      <tr
        key={user.id}
        className="border-b border-gray-200 even:bg-slate-50  text-sm hover:bg-blue-50"
      >
        <td className="flex items-center gap-2 p-3">
          <NextImage
            width={36}
            height={36}
            src={user.image?.url || noAvatar}
            alt="user"
            className="rounded-full w-9 h-9 object-cover"
          />
          <div>
            <p>{user.name}</p>
            <p className="text-xs text-gray-400 lowercase lg:hiPdden">
              {user.role}
            </p>
          </div>
        </td>

        <td className="hidden lg:table-cell">{user._count.Post || 0}</td>
        <td className={`hidden lg:table-cell capitalize`}>
          <span
            className={`badge text-sm ${
              user.role === "ADMIN" ? "badge-primary" : "badge-secondary"
            }`}
          >
            {user.role.toLowerCase()}
          </span>
        </td>
        <td className="hidden md:table-cell">{user.email}</td>

        {role === "ADMIN" && (
          <td className="flex gap-2 justify-end pr-2">
            <button
              onClick={() => {
                setModalType("UPDATE");
                setSelectedItem(user);
              }}
            >
              <div className="h-8 w-8 btn-icon relative">
                <Pencil
                  size={18}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </button>
          </td>
        )}
      </tr>
    );
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(undefined);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="mb-0">Users</h3>
        <button
          onClick={() => {
            setModalType("CREATE");
          }}
          className="btn btn-primary"
        >
          Create
        </button>

        {modalType === "CREATE" && (
          <Modal
            type="CREATE"
            data={
              <UserForm
                type="CREATE"
                setOpen={closeModal}
                setSuccess={setSuccess}
              />
            }
            setOpen={closeModal}
          />
        )}

        {modalType === "UPDATE" && (
          <Modal
            setOpen={closeModal}
            type="UPDATE"
            data={
              <UserForm
                setOpen={closeModal}
                type="UPDATE"
                data={selectedItem}
                setSuccess={setSuccess}
              />
            }
          />
        )}
      </div>
      {success && <Toast message={success} type="SUCCESS" />}

      <Table columns={columns} data={users} renderRows={renderRows} />
      <Pagination pageSize={pageSize} itemCount={usersCount} />
    </div>
  );
};

export default UsersList;
