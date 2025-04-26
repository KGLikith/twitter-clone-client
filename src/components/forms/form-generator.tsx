'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { passwordRequirements } from "@/constants/forms";
import { Check, X } from "lucide-react";

type Props = {
  type: "text" | "email" | "password" | "number";
  inputType: "select" | "input" | "textarea";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  register: UseFormRegister<any>;
  name: string;
  errors: FieldErrors<FieldValues>;
  lines?: number;
  showPasswordRequirements?: boolean;
  form?: string;
  defaultValue?: string;
  watch?: UseFormWatch<FieldValues>;
};

const FormGenerator = ({
  errors,
  inputType,
  name,
  showPasswordRequirements,
  placeholder,
  defaultValue,
  register,
  type,
  form,
  label,
  lines,
  options,
  watch
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false)
  switch (inputType) {
    case "input":
    default:
      return (
        <Label
          className="flex flex-col gap-2 text-white "
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Input
            id={`input-${label}`}
            className="bg-black"
            type={type}
            placeholder={placeholder}
            form={form}
            defaultValue={defaultValue}
            {...register(name)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsBlurred(true)}
          />
          {!showPasswordRequirements ? <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          /> :
            <>
              {isFocused &&
                <ul className="mt-2 space-y-1 transition-opacity duration-200 ">
                  {passwordRequirements.map((requirement) => {
                    const isMet = requirement.test(watch ? watch(name) : "")
                    return (
                      <li
                        key={requirement.id}
                        className={`flex items-center text-sm ${isMet ? "text-green-400" : isBlurred ? "text-red-400" : "text-gray-400"}`}
                      >
                        {isMet ? (
                          <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 mr-2 flex-shrink-0" />
                        )}
                        <span>{requirement.label}</span>
                      </li>
                    )
                  })}
                </ul>
              }
            </>
          }
        </Label>
      );
    case "select":
      return (
        <Label htmlFor={`select-${label}`}>
          {label && label}
          <select form={form} id={`select-${label}`} {...register(name)}>
            {options?.length &&
              options.map((option) => (
                <option value={option.value} key={option.id}>
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
    case "textarea":
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${label}`}>
          {label && label}
          <Textarea
            form={form}
            id={`input-${label}`}
            placeholder={placeholder}
            {...register(name)}
            rows={lines}
            defaultValue={defaultValue}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
  }
};

export default FormGenerator;
