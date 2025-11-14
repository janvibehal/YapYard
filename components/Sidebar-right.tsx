"use client";

import React, { useState } from "react";
import { X, MessageCircle, MoreHorizontal } from "lucide-react";

const mockRequests = [
  { id: 1, name: "Tyrell Barrows", avatar: "https://picsum.photos/40/40?random=1", status: "wants to add you to friends" },
  { id: 2, name: "Selena Gomez", avatar: "https://picsum.photos/40/40?random=2", status: "wants to add you to friends" },
];

const mockContacts = [
  { id: 101, name: "Amanda Miles", avatar: "https://picsum.photos/40/40?random=3" },
  { id: 102, name: "Melissa Byron", avatar: "https://picsum.photos/40/40?random=4" },
  { id: 103, name: "Ronald Bezos", avatar: "https://picsum.photos/40/40?random=5", unread: 3 },
  { id: 104, name: "Billy Rosewood", avatar: "https://picsum.photos/40/40?random=6" },
  { id: 105, name: "Katty Monroe", avatar: "https://picsum.photos/40/40?random=7", unread: 2 },
  { id: 106, name: "Kurt Williamson", avatar: "https://picsum.photos/40/40?random=8" },
];

const ContactItem = ({ name, avatar, unread, status, isRequest = false }) => (
  <div className={`flex items-start p-3 ${isRequest ? "bg-[#242424] mb-3" : ""} rounded-xl hover:bg-[#2c2c2c] transition duration-150`}>
    <img src={avatar} alt={name} className="w-10 h-10 rounded-lg mr-3" />
    <div className="flex-1 min-w-0">
      <p className="text-gray-100 font-semibold truncate">{name}</p>
      {isRequest ? (
        <>
          <p className="text-sm text-gray-400 mb-2">{status}</p>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 text-sm rounded-lg">Accept</button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-1.5 text-sm rounded-lg border border-gray-600">Decline</button>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-center h-5">
          <p className="text-sm text-gray-500">Online</p>
          {unread ? <span className="bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{unread}</span> : <MoreHorizontal className="w-5 h-5 text-gray-500 hover:text-gray-300" />}
        </div>
      )}
    </div>
  </div>
);

const SidebarRight: React.FC = () => {
  const [open, setOpen] = useState(false);
  const totalRequests = mockRequests.length;
  const totalContacts = mockContacts.length;

  return (
    <>
      <button className="fixed top-4 right-4 bg-[#1c1c1c] p-2 rounded-lg md:hidden z-[9999]" onClick={() => setOpen(true)}>
        <MessageCircle className="text-white w-6 h-6" />
        {totalRequests > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1c1c1c]">
            {totalRequests}
          </span>
        )}
      </button>

      {open && <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm md:hidden z-[9998]" onClick={() => setOpen(false)} />}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#131313] p-3 z-[9999] transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"} md:static md:translate-x-0 md:block`}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="mb-4">
          <h2 className="uppercase text-xs font-bold text-gray-400 mb-3 flex justify-between">
            REQUESTS
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalRequests}</span>
          </h2>
          <div className="space-y-3">
            {mockRequests.map((req) => (
              <ContactItem key={req.id} {...req} isRequest />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="uppercase text-xs font-bold text-gray-400 mb-3 flex justify-between">
            CONTACTS
            <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">{totalContacts}</span>
          </h2>
          <div className="space-y-1 overflow-y-auto max-h-[65vh] custom-scroll">
            {mockContacts.map((contact) => (
              <ContactItem key={contact.id} {...contact} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarRight;
