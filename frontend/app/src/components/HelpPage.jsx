import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { IoChevronDown } from "react-icons/io5";

export default function HelpPage() {
  return (
    <div className="h-screen w-full pt-32 px-4">
      <div className="mx-auto w-full max-w-lg divide-y divide-gray-950/5 rounded-xl bg-gray-950/5">
        <Disclosure as="div" className="p-6" defaultOpen={true}>
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-black group-data-[hover]:text-blue-400/80">
              How to find where the book is located?
            </span>
            <IoChevronDown className="size-5 text-blue-700/60 group-data-[hover]:text-blue-400/50 group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-black/60">
            On the dashboard, you have a status column, click on it, and the window 
            will pop out with the location of a book. 
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-black group-data-[hover]:text-blue-400/80">
              How to find who borrowed a book?
            </span>
            <IoChevronDown className="size-5 text-blue-700/60 group-data-[hover]:text-blue-400/50 group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-black/60">
            To search for a person who borrowed a book, go to the
            <p className="italic font-bold">
                "Options button &gt; Borrow"
            </p> 
            and after you enter the location, the message window will pop out with 
            the email of a person who's borrowed the book.
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-black group-data-[hover]:text-blue-400/80">
              I forgot a password, what should I do?
            </span>
            <IoChevronDown className="size-5 text-blue-700/60 group-data-[hover]:text-blue-400/50 group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-black/60">
            Contact the IT support.
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-black group-data-[hover]:text-blue-400/80">
              Why can't I access the Employees tab or add the book?
            </span>
            <IoChevronDown className="size-5 text-blue-700/60 group-data-[hover]:text-blue-400/50 group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-black/60">
            Only admins have the full privileges to add books or go to the Employees tab.
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-black group-data-[hover]:text-blue-400/80">
              What location should I specify when borrowing/returning a book?
            </span>
            <IoChevronDown className="size-5 text-blue-700/60 group-data-[hover]:text-blue-400/50 group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-black/60">
            Depending on your working location (Zagreb/Osijek), you should write
            for example: <p className="italic font-bold">"Zagreb Room X.XX"</p> 
            If you're working in a different building (Zagreb, for example), you 
            should specify it so that everyone knows the right location of a book. 
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  )
}
