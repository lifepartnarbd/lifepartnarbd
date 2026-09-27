"use client";

import { useState } from "react";

type PaymentMethod = "bKash" | "Nagad" | "Rocket" | "";

const paymentMethods = {
  bKash: {
    name: "bKash",
    number: "01710195926",
    type: "Personal",
  },
  Nagad: {
    name: "Nagad",
    number: "01870779640",
    type: "Personal",
  },
  Rocket: {
    name: "Rocket",
    number: "01715569505",
    type: "Personal",
  },
};

type Props = {
  language?: "bn" | "en";
  value?: PaymentMethod;
  onChange?: (method: PaymentMethod) => void;
};

export default function PaymentMethodSelector({
  language = "bn",
  value = "",
  onChange,
}: Props) {
  const [selected, setSelected] = useState<PaymentMethod>(value);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isBangla = language === "bn";

  const handleSelect = (method: PaymentMethod) => {
    setSelected(method);
    setOpen(false);
    setCopied(false);
    onChange?.(method);
  };

  const handleCopy = async () => {
    if (!selected) return;

    const number = paymentMethods[selected].number;

    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const selectedMethod = selected
    ? paymentMethods[selected]
    : null;

  return (
    <div className="w-full space-y-4">
      {/* Payment Method Label */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
          {isBangla ? "পেমেন্ট মেথড" : "Payment Method"}
        </label>

        {/* Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left shadow-sm transition hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900"
          >
            <span
              className={
                selected
                  ? "font-medium text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }
            >
              {selected
                ? `${selectedMethod?.name} ✓`
                : isBangla
                ? "পেমেন্ট মেথড নির্বাচন করুন"
                : "Select Payment Method"}
            </span>

            <svg
              className={`h-5 w-5 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
              {(Object.keys(paymentMethods) as Array<
                keyof typeof paymentMethods
              >).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handleSelect(method)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-emerald-50 dark:hover:bg-gray-800"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {paymentMethods[method].name}
                  </span>

                  {selected === method && (
                    <span className="font-bold text-emerald-600">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Payment Details */}
      {selectedMethod && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {selectedMethod.name}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isBangla ? "অ্যাকাউন্ট টাইপ" : "Account Type"}
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {isBangla ? "পার্সোনাল" : selectedMethod.type}
            </p>
          </div>

          {/* Number + Copy */}
          <div className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 dark:bg-gray-900">
            <span className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">
              {selectedMethod.number}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {copied
                ? isBangla
                  ? "কপি হয়েছে ✓"
                  : "Copied ✓"
                : isBangla
                ? "নম্বর কপি"
                : "Copy Number"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
