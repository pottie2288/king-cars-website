'use client'

import { useMemo, useState } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';

interface FinanceCalculatorProps {
    vehiclePrice: number;
}

/**
 * Bounds for each input. Without them the calculator will happily accept a
 * negative deposit (which inflates the loan above the car's price), a negative
 * rate, or a balloon larger than the vehicle — and then print a nine-figure
 * "estimated installment" next to the King Cars name.
 */
const LIMITS = {
    /** A deposit can't exceed the price; 90% is the practical ceiling lenders allow. */
    depositMaxRatio: 0.9,
    /** Prime has never been below 5% or above 30% in modern SA history. */
    rate: { min: 0, max: 30 },
    /** Banks cap balloons at 40% of the vehicle price. */
    balloonMaxRatio: 0.4,
} as const;

interface FieldState {
    value: number;
    /** Message shown when the typed value was clamped or rejected */
    warning: string | null;
}

/**
 * Parse a numeric input and clamp it into range, reporting when it had to be
 * corrected so the number on screen is never silently different from the
 * number the user typed.
 */
function clampField(raw: string, min: number, max: number, label: string, formatter: (n: number) => string): FieldState {
    if (raw.trim() === '') return { value: min, warning: null };

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
        return { value: min, warning: `${label} must be a number` };
    }
    if (parsed < min) {
        return { value: min, warning: `${label} can’t be less than ${formatter(min)}` };
    }
    if (parsed > max) {
        return { value: max, warning: `${label} can’t be more than ${formatter(max)}` };
    }
    return { value: parsed, warning: null };
}

export function FinanceCalculator({ vehiclePrice }: FinanceCalculatorProps) {
    // A vehicle with a missing or nonsensical price would poison every
    // calculation below, so normalise it once at the boundary.
    const price = Number.isFinite(vehiclePrice) && vehiclePrice > 0 ? vehiclePrice : 0;

    const [deposit, setDeposit] = useState(Math.round(price * 0.1).toString());
    const [interestRate, setInterestRate] = useState('13.75');
    const [months, setMonths] = useState('72');
    const [balloon, setBalloon] = useState('0');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 0,
        }).format(amount);

    const formatPercent = (value: number) => `${value}%`;

    const { monthlyPayment, warnings, totalRepaid } = useMemo(() => {
        const depositField = clampField(
            deposit, 0, price * LIMITS.depositMaxRatio, 'Deposit', formatCurrency
        );
        const rateField = clampField(
            interestRate, LIMITS.rate.min, LIMITS.rate.max, 'Interest rate', formatPercent
        );
        const balloonField = clampField(
            balloon, 0, price * LIMITS.balloonMaxRatio, 'Balloon payment', formatCurrency
        );

        const collected = [depositField.warning, rateField.warning, balloonField.warning]
            .filter((w): w is string => w !== null);

        const term = Number(months) || 72;
        const principal = price - depositField.value;
        const loanAmount = principal - balloonField.value;
        const monthlyRate = rateField.value / 100 / 12;

        // Every input is clamped above, so the only remaining degenerate case
        // is a deposit + balloon that together cover the whole vehicle.
        if (price <= 0 || loanAmount <= 0) {
            return { monthlyPayment: 0, warnings: collected, totalRepaid: 0 };
        }

        let repayment: number;
        if (monthlyRate === 0) {
            repayment = loanAmount / term;
        } else {
            const growth = Math.pow(1 + monthlyRate, term);
            const amortization = (loanAmount * growth * monthlyRate) / (growth - 1);
            // Interest keeps accruing on the balloon for the whole term.
            repayment = amortization + balloonField.value * monthlyRate;
        }

        // Final guard: if anything above still produced a non-finite result,
        // show nothing rather than "R NaN" or "R Infinity".
        if (!Number.isFinite(repayment) || repayment < 0) {
            return { monthlyPayment: 0, warnings: collected, totalRepaid: 0 };
        }

        return {
            monthlyPayment: repayment,
            warnings: collected,
            totalRepaid: repayment * term + balloonField.value + depositField.value,
        };
    }, [price, deposit, interestRate, months, balloon]);

    const inputCls = 'w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-king-blue focus:ring-0 text-gray-900 bg-gray-50';

    /** Stop the number input accepting minus signs and exponent notation. */
    const blockNegativeKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-king-blue/10 flex items-center justify-center text-king-blue">
                    <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900">Finance Calculator</h3>
            </div>

            <div className="space-y-4">
                {/* Deposit */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (R)</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={Math.round(price * LIMITS.depositMaxRatio)}
                        step={1000}
                        value={deposit}
                        onKeyDown={blockNegativeKeys}
                        onChange={(e) => setDeposit(e.target.value)}
                        className={inputCls}
                    />
                </div>

                {/* Interest Rate & Term */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate (%)</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            min={LIMITS.rate.min}
                            max={LIMITS.rate.max}
                            step={0.25}
                            value={interestRate}
                            onKeyDown={blockNegativeKeys}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Months</label>
                        <select
                            value={months}
                            onChange={(e) => setMonths(e.target.value)}
                            className={inputCls}
                        >
                            {[12, 24, 36, 48, 60, 72].map((m) => (
                                <option key={m} value={m}>{m} Months</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Balloon */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Balloon Payment (R)</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={Math.round(price * LIMITS.balloonMaxRatio)}
                        step={1000}
                        value={balloon}
                        onKeyDown={blockNegativeKeys}
                        onChange={(e) => setBalloon(e.target.value)}
                        className={inputCls}
                    />
                </div>

                {/* Tell the user their figure was adjusted, rather than quietly
                    calculating something different from what they typed. */}
                {warnings.length > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1">
                        {warnings.map((warning) => (
                            <p key={warning} className="text-xs text-amber-700 flex items-start gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                {warning} — we&apos;ve used the closest allowed value.
                            </p>
                        ))}
                    </div>
                )}

                <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex items-end justify-between gap-3 mb-2">
                        <span className="text-gray-600 font-medium flex-shrink-0">Est. Installment</span>
                        <span className="text-2xl font-bold text-king-blue text-right break-words">
                            {monthlyPayment > 0 ? formatCurrency(monthlyPayment) : '—'}
                        </span>
                    </div>
                    {monthlyPayment > 0 && (
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span>Total repaid over term</span>
                            <span>{formatCurrency(totalRepaid)}</span>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 text-center flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        Subject to credit check &amp; lender approval. Terms &amp; conditions apply.
                    </p>
                </div>
            </div>
        </div>
    );
}
