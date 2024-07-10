"use client"

import { useState } from 'react';
import { UpdateProfile } from "@/app/_lib/actions";
import SubmitButton from "@/app/_components/SubmitButton";

export default function UpdateProfileForm({ children, guest }) {
  const { fullName, email, nationalID, countryFlag } = guest;
  const [errorMessage, setErrorMessage] = useState('');
  const [nationalIdValue, setNationalIdValue] = useState(nationalID);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const validateNationalID = (id) => {
    const regex = /^[a-zA-Z0-9]{6,12}$/;
    if (!regex.test(id)) {
      setErrorMessage('Please provide a valid National ID (6-12 alphanumeric characters).');
      setIsSubmitDisabled(true);
      return false;
    }
    setErrorMessage('');
    setIsSubmitDisabled(false);
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nationalID = formData.get('nationalID');
    if (validateNationalID(nationalID)) {
      await UpdateProfile(formData);
    }
  };

  const handleNationalIDChange = (event) => {
    setNationalIdValue(event.target.value);
    validateNationalID(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col">
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={fullName}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <img
            src={countryFlag}
            alt="Country flag"
            className="h-5 rounded-sm"
          />
        </div>
      </div>

      {children}

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          value={nationalIdValue}
          onChange={handleNationalIDChange}
          name="nationalID"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>

      <div className="flex justify-end items-center gap-6">
        <SubmitButton disabled={isSubmitDisabled}>
          Update profile
        </SubmitButton>
      </div>
    </form>
  );
}