'use client'

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
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Upload,
    Info,
    ShieldCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { PERSONAL_BANKS } from '@/data/banks';
import { trackEvent } from '@/lib/analytics';
import {
    isValidSAPhone,
    isValidSAID,
    validateEmail,
    FIELD_LIMITS,
    NUMERIC_LIMITS,
} from '@/lib/validation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './ui/select';

/**
 * A dropdown that was never opened arrives as `undefined`, which Zod reports
 * as "Invalid input: expected string, received undefined" — accurate for a
 * developer, meaningless to a customer. This builds a string field whose
 * missing-value message and empty-value message are the same plain sentence.
 */
const requiredChoice = (message: string) =>
    z.string({ error: message }).min(1, message);

/** Free-text field with a floor, a ceiling, and human wording at both ends. */
const requiredText = (label: string, min: number, max: number) =>
    z.string({ error: `${label} is required` })
        .trim()
        .min(min, min <= 2 ? `${label} is required` : `${label} must be at least ${min} characters`)
        .max(max, `${label} must be ${max} characters or fewer`);

/**
 * Rand amount typed into a number input. Rejects blanks, junk, negatives and
 * implausible values — the tester submitted "-44556565232" through here.
 */
const randAmount = (label: string, { min, max }: { min: number; max: number }) =>
    z.string({ error: `${label} is required` })
        .trim()
        .min(1, `${label} is required`)
        .refine(v => /^\d+(\.\d{1,2})?$/.test(v), {
            message: `${label} must be a positive amount (no minus sign or letters)`,
        })
        .refine(v => Number(v) >= min, {
            message: `${label} must be at least R${min.toLocaleString('en-ZA')}`,
        })
        .refine(v => Number(v) <= max, {
            message: `${label} can’t be more than R${max.toLocaleString('en-ZA')}`,
        });

const formSchema = z.object({
    // Step 1: Personal
    fullName: requiredText('Full name', 3, FIELD_LIMITS.name),
    idNumber: z.string({ error: 'SA ID number is required' })
        .trim()
        .refine(isValidSAID, 'Enter a valid 13-digit SA ID number'),
    // superRefine so the message is the specific one validateEmail produced
    // (bad format vs. placeholder domain), not a single catch-all string.
    email: z.string({ error: 'Email address is required' })
        .trim()
        .superRefine((value, ctx) => {
            const result = validateEmail(value);
            if (!result.valid) {
                ctx.addIssue({ code: 'custom', message: result.error ?? 'Enter a valid email address' });
            }
        }),
    phone: z.string({ error: 'Phone number is required' })
        .refine(isValidSAPhone, 'Enter a valid SA phone number (e.g. 082 123 4567)'),
    maritalStatus: requiredChoice('Please select your marital status'),
    province: requiredChoice('Please select your region'),

    // Step 2: Employment
    employmentType: requiredChoice('Please select your employment type'),
    employerName: requiredText('Employer name', 2, FIELD_LIMITS.employerName),
    occupation: requiredText('Occupation', 2, FIELD_LIMITS.occupation),
    workPhone: z.string({ error: 'Work phone is required' })
        .refine(isValidSAPhone, 'Enter a valid SA phone number (e.g. 021 123 4567)'),
    netIncome: randAmount('Monthly net income', NUMERIC_LIMITS.netIncome),
    totalExpenses: randAmount('Total monthly expenses', NUMERIC_LIMITS.totalExpenses),

    // Step 3: Banking & Address
    physicalAddress: requiredText('Full address', 10, FIELD_LIMITS.address),
    bankName: requiredChoice('Please select your bank'),
    bankNameOther: z.string().trim().max(FIELD_LIMITS.bankOther, `Bank name must be ${FIELD_LIMITS.bankOther} characters or fewer`).optional(),

    // Consent
    popiaConsent: z.boolean().refine(val => val === true, 'You must accept the POPIA policy'),
    creditConsent: z.boolean().refine(val => val === true, 'You must authorize a credit check')
}).refine(
    // "Other" is only useful if they tell us which bank it actually is.
    data => data.bankName !== 'other' || (data.bankNameOther?.trim().length ?? 0) >= 2,
    { message: 'Please type the name of your bank', path: ['bankNameOther'] }
);

type FormData = z.infer<typeof formSchema>;

export function FinanceApplicationForm() {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
    const [lastData, setLastData] = useState<FormData | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        watch,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            maritalStatus: '',
            province: '',
            employmentType: '',
            bankName: '',
            bankNameOther: '',
            popiaConsent: false,
            creditConsent: false
        }
    });

    // Each step unmounts when you navigate away, so an uncontrolled Radix
    // Select would lose its displayed value and reappear on the placeholder
    // even though the answer was still in form state. Watching these and
    // feeding them back as `value` keeps the UI and the data in step.
    const maritalStatus = watch('maritalStatus');
    const province = watch('province');
    const employmentType = watch('employmentType');
    const bankName = watch('bankName');

    /** Set a dropdown value and re-validate it immediately, so the error clears. */
    const selectValue = (field: 'maritalStatus' | 'province' | 'employmentType' | 'bankName', value: string) => {
        setValue(field, value, { shouldValidate: true, shouldDirty: true });
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof FormData)[] = [];
        if (step === 1) fieldsToValidate = ['fullName', 'idNumber', 'email', 'phone', 'maritalStatus', 'province'];
        if (step === 2) fieldsToValidate = ['employmentType', 'employerName', 'occupation', 'workPhone', 'netIncome', 'totalExpenses'];
        if (step === 3) fieldsToValidate = ['physicalAddress', 'bankName', 'bankNameOther'];

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitError(false);
        setSubmitErrorMessage(null);
        setLastData(data);
        try {
            const res = await fetch('/api/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                // Show the server's actual reason (validation or rate limit)
                // rather than a generic failure the applicant can't act on.
                const payload = await res.json().catch(() => null);
                throw new Error(payload?.error ?? `Finance application failed: ${res.status}`);
            }
            setIsSubmitted(true);
            trackEvent('finance_application_submitted', { bank: data.bankName });
        } catch (err) {
            // Don't fake success — surface an honest error so the lead isn't lost silently.
            setSubmitError(true);
            setSubmitErrorMessage(err instanceof Error ? err.message : null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const retrySubmit = () => { if (lastData) onSubmit(lastData); };

    if (submitError) {
        return (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card text-center animate-fade-in">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">Something went wrong</h2>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    {submitErrorMessage ?? 'We couldn’t submit your application just now.'} Your details are
                    still here — please try again. If it keeps happening, call us on{' '}
                    <a href="tel:0835008181" className="text-king-blue font-semibold">083 500 8181</a>.
                </p>
                <button
                    onClick={retrySubmit}
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting…' : 'Try Again'}
                </button>
            </div>
        );
    }

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
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8 text-left max-w-md mx-auto">
                    <h4 className="font-medium text-king-blue mb-3 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Documents to have ready
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Our consultant will request these when they contact you:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Copy of Green ID/Card', '3 Months Payslips', '3 Months Bank Statements', 'Proof of Residence', "Valid Driver's License"].map((doc, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-king-cyan flex-shrink-0" />
                                {doc}
                            </li>
                        ))}
                    </ul>
                </div>
                <Button
                    onClick={() => {
                        setIsSubmitted(false);
                        setStep(1);
                    }}
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
                                <Input placeholder="John Doe" maxLength={FIELD_LIMITS.name} {...register('fullName')} className="py-6 rounded-xl" />
                                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">SA ID Number</label>
                                <Input placeholder="9001015000081" inputMode="numeric" maxLength={13} {...register('idNumber')} className="py-6 rounded-xl" />
                                {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <Input type="email" placeholder="john@gmail.com" maxLength={254} {...register('email')} className="py-6 rounded-xl" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <Input placeholder="082 123 4567" inputMode="tel" maxLength={20} {...register('phone')} className="py-6 rounded-xl" />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Marital Status</label>
                                <Select value={maritalStatus} onValueChange={(val) => selectValue('maritalStatus', val)}>
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
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Which Region Are You In?</label>
                                <Select value={province} onValueChange={(val) => selectValue('province', val)}>
                                    <SelectTrigger className="py-6 rounded-xl">
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Western Cape">Western Cape</SelectItem>
                                        <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>}
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
                                <Select value={employmentType} onValueChange={(val) => selectValue('employmentType', val)}>
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
                                <Input placeholder="Company Name" maxLength={FIELD_LIMITS.employerName} {...register('employerName')} className="py-6 rounded-xl" />
                                {errors.employerName && <p className="text-red-500 text-xs mt-1">{errors.employerName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Occupation</label>
                                <Input placeholder="Manager, Engineer, etc." maxLength={FIELD_LIMITS.occupation} {...register('occupation')} className="py-6 rounded-xl" />
                                {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Work Phone</label>
                                <Input placeholder="021 123 4567" inputMode="tel" maxLength={20} {...register('workPhone')} className="py-6 rounded-xl" />
                                {errors.workPhone && <p className="text-red-500 text-xs mt-1">{errors.workPhone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Monthly Net Income (after tax)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R</span>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="15000"
                                        min={NUMERIC_LIMITS.netIncome.min}
                                        max={NUMERIC_LIMITS.netIncome.max}
                                        step={1}
                                        onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                        {...register('netIncome')}
                                        className="pl-10 py-6 rounded-xl"
                                    />
                                </div>
                                {errors.netIncome && <p className="text-red-500 text-xs mt-1">{errors.netIncome.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Total Monthly Expenses</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R</span>
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="8000"
                                        min={NUMERIC_LIMITS.totalExpenses.min}
                                        max={NUMERIC_LIMITS.totalExpenses.max}
                                        step={1}
                                        onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                        {...register('totalExpenses')}
                                        className="pl-10 py-6 rounded-xl"
                                    />
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
                                    maxLength={FIELD_LIMITS.address}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none min-h-[100px]"
                                    placeholder="House No, Street Name, Suburb, City, Code"
                                />
                                {errors.physicalAddress && <p className="text-red-500 text-xs mt-1">{errors.physicalAddress.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Main Banking Institution</label>
                                <Select value={bankName} onValueChange={(val) => selectValue('bankName', val)}>
                                    <SelectTrigger className="py-6 rounded-xl">
                                        <SelectValue placeholder="Select Bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PERSONAL_BANKS.map((bank) => (
                                            <SelectItem key={bank.id} value={bank.id}>
                                                {bank.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>}
                            </div>

                            {/* Picking "Other" without naming the bank leaves the
                                finance team with nothing to work from. */}
                            {bankName === 'other' && (
                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-sm font-medium text-gray-700">Which bank do you use?</label>
                                    <Input
                                        placeholder="e.g. African Bank, TymeBank, Bidvest Bank"
                                        maxLength={FIELD_LIMITS.bankOther}
                                        {...register('bankNameOther')}
                                        className="py-6 rounded-xl"
                                    />
                                    {errors.bankNameOther && <p className="text-red-500 text-xs mt-1">{errors.bankNameOther.message}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 4: Documents & Consent */}
                {step === 4 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-5 h-5 text-king-blue" />
                            <h3 className="font-display font-semibold text-xl text-gray-900">Get Pre-Approved</h3>
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
                            disabled={isSubmitting}
                            className="bg-king-cyan hover:bg-accent-light text-white rounded-xl px-12 py-6 shadow-lg shadow-cyan-500/20 font-bold disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
