"use client";
import React, { useState, Fragment } from "react";
import Layout from "@/app/components/Layout";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown, Car, Bike, Bus, CheckCircle2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const vehicleTypes = [
  { name: "Car", icon: <Car className="w-3.5 h-3.5 mr-2" /> },
  { name: "Bike", icon: <Bike className="w-3.5 h-3.5 mr-2" /> },
  { name: "Bus", icon: <Bus className="w-3.5 h-3.5 mr-2" /> },
];

export default function RegisterVehicle() {
  const [owner, setOwner] = useState("");
  const [plate, setPlate] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState(vehicleTypes[0]);
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    const vehicle = {
      owner_name: owner,
      plate_number: plate,
      department,
      phone,
      vehicle_type: type.name,
      vehicle_color: color,
      status: "active",
    };

    try {
      await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicle),
      });
      setSuccessOpen(true);
      // Reset form
      setOwner("");
      setPlate("");
      setDepartment("");
      setPhone("");
      setType(vehicleTypes[0]);
      setColor("");
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Register New Vehicle</h1>
          <p className="text-slate-500 text-sm">Add a vehicle to the authorized monitoring system.</p>
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Owner Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Plate Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ABC-1234"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-mono text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <PhoneInput
                  country={"ng"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  containerClass="!w-full"
                  inputClass="!w-full !h-auto !bg-slate-50 !border-slate-200 !py-2.5 !pl-12 !rounded-xl !text-sm !text-slate-700 !outline-none"
                  buttonClass="!bg-transparent !border-none !rounded-l-xl !pl-2"
                  dropdownClass="!rounded-xl !shadow-xl !border-slate-100 !text-sm"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Vehicle Type <span className="text-rose-500">*</span>
                </label>
                <Listbox value={type} onChange={setType}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer bg-slate-50 border border-slate-200 py-2.5 pl-3 pr-10 text-left rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition">
                      <span className="flex items-center truncate">
                        {type.icon} {type.name}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5 outline-none text-sm">
                        {vehicleTypes.map((v, idx) => (
                          <Listbox.Option
                            key={idx}
                            className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-50 text-blue-700" : "text-slate-700"}`}
                            value={v}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`flex items-center truncate ${selected ? "font-bold" : "font-normal"}`}>
                                  {v.icon} {v.name}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <Check className="w-4 h-4" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              <div>
                <label className="block mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Vehicle Color <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Midnight Blue"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-all text-white font-bold text-xs uppercase tracking-widest px-4 py-3.5 rounded-xl shadow-lg shadow-slate-200 mt-4"
            >
              {loading ? "Processing..." : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 mb-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Registration Successful</h3>
            <p className="text-sm text-slate-500 mb-6">The vehicle has been added to the monitoring system.</p>
            <button
              onClick={() => setSuccessOpen(false)}
              className="w-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              Back to Registry
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
