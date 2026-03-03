import { useState, useEffect } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';

interface FinanceCalculatorProps {
    vehiclePrice: number;
}

export function FinanceCalculator({ vehiclePrice }: FinanceCalculatorProps) {
    const [deposit, setDeposit] = useState((vehiclePrice * 0.1).toString()); // Default 10%
    const [interestRate, setInterestRate] = useState('13.75'); // Prime + ~2%
    const [months, setMonths] = useState('72');
    const [balloon, setBalloon] = useState('0');
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        calculateRepayment();
    }, [vehiclePrice, deposit, interestRate, months, balloon]);

    const calculateRepayment = () => {
        const principal = vehiclePrice - (parseFloat(deposit) || 0);
        const rate = (parseFloat(interestRate) || 0) / 100 / 12;
        const term = parseInt(months) || 72;
        const balloonAmount = (parseFloat(balloon) || 0);

        if (principal <= 0) {
            setMonthlyPayment(0);
            return;
        }

        // Standard PMT formula with balloon
        // P = (Pv - Fv / (1 + i)^n) * (i / (1 - (1 + i)^-n))
        // Where Pv = Principal, Fv = Balloon, i = monthly rate, n = months

        // Simplified approximation for display
        // Monthly Interest on Balloon
        const balloonInterest = balloonAmount * rate;

        // Amortization of the rest
        const loanAmount = principal - balloonAmount;

        let repayment = 0;

        if (rate === 0) {
            repayment = principal / term;
        } else {
            const x = Math.pow(1 + rate, term);
            const amortization = (loanAmount * x * rate) / (x - 1);
            repayment = amortization + balloonInterest;
        }

        setMonthlyPayment(repayment);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 0,
        }).format(amount);
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
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-king-blue focus:ring-0 text-gray-900 bg-gray-50"
                    />
                </div>

                {/* Interest Rate & Term */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate (%)</label>
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-king-blue focus:ring-0 text-gray-900 bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Months</label>
                        <select
                            value={months}
                            onChange={(e) => setMonths(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-king-blue focus:ring-0 text-gray-900 bg-gray-50"
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
                        value={balloon}
                        onChange={(e) => setBalloon(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-king-blue focus:ring-0 text-gray-900 bg-gray-50"
                    />
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex items-end justify-between mb-2">
                        <span className="text-gray-600 font-medium">Est. Installment</span>
                        <span className="text-2xl font-bold text-king-blue">{formatCurrency(monthlyPayment)}</span>
                    </div>
                    <p className="text-xs text-gray-400 text-center flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        Subject to credit check & lender approval. Terms & conditions apply.
                    </p>
                </div>
            </div>
        </div>
    );
}
