"use client";
import React, { useState, Fragment } from "react";
import Layout from "@/app/components/Layout";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown, Car, Bike, Bus } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const vehicleTypes = [
  { name: "Car", icon: <Car className="w-4 h-4 inline-block mr-1" /> },
  { name: "Bike", icon: <Bike className="w-4 h-4 inline-block mr-1" /> },
  { name: "Bus", icon: <Bus className="w-4 h-4 inline-block mr-1" /> },
];

export default function RegisterVehicle() {
  const [owner, setOwner] = useState("");
  const [plate, setPlate] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState(vehicleTypes[0]);
  const [color, setColor] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const vehicle = {
      owner_name: owner,
      plate_number: plate,
      department,
      phone,
      vehicle_type: type.name,
      vehicle_color: color,
      status: "allowed",
    };

    console.log(vehicle);
    alert("Vehicle Registered (simulation)");

    setOwner("");
    setPlate("");
    setDepartment("");
    setPhone("");
    setType(vehicleTypes[0]);
    setColor("");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-[#1E1F20]">
        Register Vehicle
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow max-w-2xl mx-auto">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Owner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter owner name"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Plate Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter plate number"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              placeholder="Enter department (optional)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>

            <PhoneInput
              country={"ng"}
              value={phone}
              onChange={(value) => setPhone(value)}
              inputClass="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              buttonClass="ml-0 border border-gray-300 rounded-l-lg"
              dropdownClass="shadow-lg text-[#1E1F20]"
              enableSearch={true}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Vehicle Type <span className="text-red-500">*</span>
            </label>
            <Listbox
              value={type}
              onChange={setType}
              as="div"
              className="relative"
            >
              <Listbox.Button className="relative w-full cursor-pointer border border-gray-300 rounded-lg bg-white py-3 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-400">
                <span className="truncate text-gray-900 flex items-center">
                  {type.icon} {type.name}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {vehicleTypes.map((vehicle, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                          active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                        }`
                      }
                      value={vehicle}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={` truncate flex items-center ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {vehicle.icon} {vehicle.name}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                              <Check className="w-5 h-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Vehicle Color <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter vehicle color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-4 py-3 rounded-lg"
          >
            Register Vehicle
          </button>
        </form>
      </div>
    </Layout>
  );
}
