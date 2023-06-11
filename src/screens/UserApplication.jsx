import { ref, push } from "firebase/database";
import { getDatabase } from "firebase/database";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ApplicantInfo from '../components/client/apply/forms/ApplicantInfo';
import EmploymentInfo from '../components/client/apply/forms/EmploymentInfo';
import VehicleInfo from '../components/client/apply/forms/VehicleInfo';
import CustomAlert from '../components/client/CustomAlert';
import LandingHeader from '../components/client/LandingHeader';
import ProgressBar from '../components/client/apply/ProgressBar';
import UploadDocs from '../components/client/apply/forms/UploadDocs';
import { v4 as uuidv4 } from 'uuid';


const UserApplication = () => {
  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [tempId, setTempId] = useState(uuidv4());

  const methods = useForm({ defaultValues: {}, mode: 'onBlur' });
  const { trigger, getValues, reset } = methods;

  useEffect(() => {
    // Initialize a temporary ID when the component mounts
    const db = getDatabase();
    const newPostKey = push(ref(db, 'temp')).key;
    setTempId(newPostKey);
  }, []);
  const handleNext = async () => {
    const isFormValid = await trigger();

    if (isFormValid) {
      if (step < components.length - 1) {
        setStep(step + 1);
      }
    } else {
      setErrorMessage('Please correct the errors before proceeding');
    }
  };

  const handleAlertDismiss = () => {
    setErrorMessage(null);
  };

  const handlePrev = () => {
    if (step > 0) {
      reset(getValues());  // Save the form data when navigating back
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const isFormValid = await trigger();

    if (isFormValid) {
      console.log('Form submitted');
      console.log(getValues());
    } else {
      setErrorMessage('Please correct the errors before proceeding');
    }
  };

  const components = [
    <UploadDocs formMethods={methods} tempId={tempId} />,
    <VehicleInfo formMethods={methods} />,
    <ApplicantInfo formMethods={methods} />,
    <EmploymentInfo formMethods={methods} />,
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cyan-50 ">
        <LandingHeader />
        
        <div className=" max-w-2xl justify-center items-center mx-auto mt-20  bg-white rounded-md p-4 shadow-md mb-20" >
          <div className='mb-10 mt-4'>
        <ProgressBar  step={step + 1} totalSteps={components.length} />
        </div>
        {components[step]}

        <div className="flex justify-between mt-4 mx-4">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 text-white bg-cyan-500 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          
          {step < components.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-white bg-cyan-500 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-cyan-500 rounded-md"
            >
              Submit
            </button>
          )}
        </div>
      </div>
      {errorMessage && <CustomAlert message={errorMessage} onDismiss={handleAlertDismiss} />}
    </div>
  );
};

export default UserApplication;
