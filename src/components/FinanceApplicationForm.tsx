import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User,
    Briefcase,
    Building2,
    FileText,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Upload,
    Info,
    ShieldCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './ui/select';

const formSchema = z.object({
    // Step 1: Personal
    fullName: z.string().min(3, 'Full name is required'),
    idNumber: z.string().length(13, 'SA ID Number must be 13 digits'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Valid phone number is required'),
    maritalStatus: z.string().min(1, 'Please select marital status'),

    // Step 2: Employment
    employmentType: z.string().min(1, 'Please select employment type'),
    employerName: z.string().min(2, 'Employer name is required'),
    occupation: z.string().min(2, 'Occupation is required'),
    workPhone: z.string().min(10, 'Work phone is required'),
    netIncome: z.string().min(1, 'Monthly net income is required'),
    totalExpenses: z.string().min(1, 'Monthly expenses are required'),

    // Step 3: Banking & Address
    physicalAddress: z.string().min(10, 'Full address is required'),
    bankName: z.string().min(1, 'Bank name is required'),

    // Consent
    popiaConsent: z.boolean().refine(val => val === true, 'You must accept the POPIA policy'),
    creditConsent: z.boolean().refine(val => val === true, 'You must authorize a credit check')
});

type FormData = z.infer<typeof formSchema>;

export function FinanceApplicationForm() {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            popiaConsent: false,
            creditConsent: false
        }
    });

    const nextStep = async () => {
        let fieldsToValidate: (keyof FormData)[] = [];
        if (step === 1) fieldsToValidate = ['fullName', 'idNumber', 'email', 'phone', 'maritalStatus'];
        if (step === 2) fieldsToValidate = ['employmentType', 'employerName', 'occupation', 'workPhone', 'netIncome', 'totalExpenses'];
        if (step === 3) fieldsToValidate = ['physicalAddress', 'bankName'];

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const onSubmit = (data: FormData) => {
        console.log('Form Submitted:', data);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">Application Received!</h2>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Thank you for applying. One of our finance experts will review your application and contact you within 24-48 hours.
                </p>
                <Button
                    onClick={() => window.location.reload()}
                    className="bg-king-blue hover:bg-primary-light text-white px-8 py-6 rounded-xl text-lg"
                >
                    Back to Finance
                </Button>
            </div>
        );
    }

    return (
        <div id="application-form" className="bg-white rounded-3xl shadow-2xl overflow-hidden scroll-mt-24">
            {/* Header */}
            <div className="bg-king-blue p-6 sm:p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-2xl">Finance Application</h2>
                        <p className="text-blue-100 text-sm">Step {step} of 4</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full mt-6">
                    <div
                        className="h-full bg-king-cyan rounded-full transition-all duration-500"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10">
                {/* Step 1: Personal Details */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-king-blue" />
                            <h3 className="font-display font-semibold text-xl text-gray-900">Personal Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name (as per ID)</label>
                                <Input placeholder="John Doe" {...register('fullName')} className="py-6 rounded-xl" />
                                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">SA ID Number</label>
                                <Input placeholder="9001015000081" {...register('idNumber')} className="py-6 rounded-xl" />
                                {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <Input type="email" placeholder="john@example.com" {...register('email')} className="py-6 rounded-xl" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <Input placeholder="082 123 4567" {...register('phone')} className="py-6 rounded-xl" />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Marital Status</label>
                                <Select onValueChange={(val) => setValue('maritalStatus', val)}>
                                    <SelectTrigger className="py-6 rounded-xl">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="married_cop">Married COP</SelectItem>
                                        <SelectItem value="married_anc">Married ANC</SelectItem>
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                        <SelectItem value="widowed">Widowed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus.message}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Employment & Income */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <Briefcase className="w-5 h-5 text-king-blue" />
                            <h3 className="font-display font-semibold text-xl text-gray-900">Employment & Income</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Employment Type</label>
                                <Select onValueChange={(val) => setValue('employmentType', val)}>
                                    <SelectTrigger className="py-6 rounded-xl">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="permanent">Permanent Employee</SelectItem>
                                        <SelectItem value="contract">Contract Worker</SelectItem>
                                        <SelectItem value="self_employed">Self-Employed</SelectItem>
                                        <SelectItem value="pensioner">Pensioner</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Employer Name</label>
                                <Input placeholder="Company Name" {...register('employerName')} className="py-6 rounded-xl" />
                                {errors.employerName && <p className="text-red-500 text-xs mt-1">{errors.employerName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Occupation</label>
                                <Input placeholder="Manager, Engineer, etc." {...register('occupation')} className="py-6 rounded-xl" />
                                {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Work Phone</label>
                                <Input placeholder="021 123 4567" {...register('workPhone')} className="py-6 rounded-xl" />
                                {errors.workPhone && <p className="text-red-500 text-xs mt-1">{errors.workPhone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Monthly Net Income (after tax)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R</span>
                                    <Input type="number" placeholder="15000" {...register('netIncome')} className="pl-10 py-6 rounded-xl" />
                                </div>
                                {errors.netIncome && <p className="text-red-500 text-xs mt-1">{errors.netIncome.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Total Monthly Expenses</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R</span>
                                    <Input type="number" placeholder="8000" {...register('totalExpenses')} className="pl-10 py-6 rounded-xl" />
                                </div>
                                {errors.totalExpenses && <p className="text-red-500 text-xs mt-1">{errors.totalExpenses.message}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Banking & Address */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <Building2 className="w-5 h-5 text-king-blue" />
                            <h3 className="font-display font-semibold text-xl text-gray-900">Banking & Address</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Physical Residential Address</label>
                                <textarea
                                    {...register('physicalAddress')}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none min-h-[100px]"
                                    placeholder="House No, Street Name, Suburb, City, Code"
                                />
                                {errors.physicalAddress && <p className="text-red-500 text-xs mt-1">{errors.physicalAddress.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Main Banking Institution</label>
                                <Select onValueChange={(val) => setValue('bankName', val)}>
                                    <SelectTrigger className="py-6 rounded-xl">
                                        <SelectValue placeholder="Select Bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="absa">ABSA</SelectItem>
                                        <SelectItem value="fnb">FNB</SelectItem>
                                        <SelectItem value="standard_bank">Standard Bank</SelectItem>
                                        <SelectItem value="nedbank">Nedbank</SelectItem>
                                        <SelectItem value="capitec">Capitec</SelectItem>
                                        <SelectItem value="discovery">Discovery Bank</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Documents & Consent */}
                {step === 4 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-5 h-5 text-king-blue" />
                            <h3 className="font-display font-semibold text-xl text-gray-900">Finalize Application</h3>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
                            <h4 className="font-medium text-king-blue mb-4 flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Required Documents for Processing
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Our consultants will request the following documents after submission:
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['Copy of Green ID/Card', '3 Months Payslips', '3 Months Bank Statements', 'Proof of Residence', 'Valid Driver\'s License'].map((doc, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-king-cyan" />
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <Checkbox
                                    id="popia"
                                    onCheckedChange={(checked) => setValue('popiaConsent', checked === true)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor="popia" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        I accept the POPIA Privacy Policy
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        We respect your privacy and will process your personal information securely.
                                    </p>
                                </div>
                            </div>
                            {errors.popiaConsent && <p className="text-red-500 text-xs">{errors.popiaConsent.message}</p>}

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <Checkbox
                                    id="credit"
                                    onCheckedChange={(checked) => setValue('creditConsent', checked === true)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor="credit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Authorize Credit Check
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        I authorize King Cars and its partners to conduct a credit check for this application.
                                    </p>
                                </div>
                            </div>
                            {errors.creditConsent && <p className="text-red-500 text-xs">{errors.creditConsent.message}</p>}
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-700 text-sm">
                            <Info className="w-5 h-5 flex-shrink-0" />
                            <p>By clicking submit, your application will be securely sent to our finance department.</p>
                        </div>
                    </div>
                )}

                {/* Footer Controls */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                    {step > 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="rounded-xl px-6 py-6 border-2 border-gray-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 4 ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="bg-king-blue hover:bg-primary-light text-white rounded-xl px-8 py-6 shadow-lg shadow-blue-500/20"
                        >
                            Next Step
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="bg-king-cyan hover:bg-accent-light text-white rounded-xl px-12 py-6 shadow-lg shadow-cyan-500/20 font-bold"
                        >
                            Submit Application
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
