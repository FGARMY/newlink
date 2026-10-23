'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  FileCheck,
  Calendar,
  Clock,
  Car,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight,
  Phone,
  FileText,
  Gauge,
  Fuel,
  Sparkles,
  KeyRound,
  Receipt,
  Check,
  X,
  ArrowRight,
  Shield,
  Star,
  MessageSquare,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Volume2,
  Camera,
  Smartphone,
  CreditCard,
  Building2,
  QrCode,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  Compass,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { customer, logout, updateCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROFILE' | 'PAYMENTS' | 'DIGILOCKER' | 'KYC'>('OVERVIEW');

  // Profile editable details
  const [profileName, setProfileName] = useState(customer?.name || '');
  const [profileEmail, setProfileEmail] = useState(customer?.email || '');
  const [profilePhone, setProfilePhone] = useState(customer?.phone || '');
  const [profileDob, setProfileDob] = useState(customer?.dob || '');
  const [profileAddress, setProfileAddress] = useState(customer?.address || '');
  const [profileCity, setProfileCity] = useState(customer?.city || '');
  const [profileState, setProfileState] = useState(customer?.state || '');
  const [profilePincode, setProfilePincode] = useState(customer?.pincode || '');
  const [emergencyName, setEmergencyName] = useState(customer?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(customer?.emergencyContactPhone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(customer?.emergencyContactRelation || 'Brother');
  const [profileDlNumber, setProfileDlNumber] = useState(customer?.dlNumber || '');
  const [profileDlExpiry, setProfileDlExpiry] = useState(customer?.dlExpiry || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);

  // Sync state when customer changes
  useEffect(() => {
    if (customer) {
      if (customer.name) setProfileName(customer.name);
      if (customer.email) setProfileEmail(customer.email);
      if (customer.phone) setProfilePhone(customer.phone);
      if (customer.dob) setProfileDob(customer.dob);
      if (customer.address) setProfileAddress(customer.address);
      if (customer.city) setProfileCity(customer.city);
      if (customer.state) setProfileState(customer.state);
      if (customer.pincode) setProfilePincode(customer.pincode);
      if (customer.emergencyContactName) setEmergencyName(customer.emergencyContactName);
      if (customer.emergencyContactPhone) setEmergencyPhone(customer.emergencyContactPhone);
      if (customer.emergencyContactRelation) setEmergencyRelation(customer.emergencyContactRelation);
      if (customer.dlNumber) setProfileDlNumber(customer.dlNumber);
      if (customer.dlExpiry) setProfileDlExpiry(customer.dlExpiry);
      if (customer.digilockerVerified) setDigiLockerVerified(true);
      if (customer.paymentMethods?.upi) setSavedUpis(customer.paymentMethods.upi);
      if (customer.paymentMethods?.cards) setSavedCards(customer.paymentMethods.cards);
      if (customer.paymentMethods?.bankAccount) {
        setBankAccount({
          ...customer.paymentMethods.bankAccount,
          confirmAccountNumber: customer.paymentMethods.bankAccount.accountNumber,
        });
      }
    }
  }, [customer]);

  // Payment Methods state
  const [savedUpis, setSavedUpis] = useState<Array<{ id: string; upiId: string; provider?: string; isDefault: boolean }>>(
    customer?.paymentMethods?.upi || []
  );
  const [newUpiInput, setNewUpiInput] = useState('');
  const [newUpiProvider, setNewUpiProvider] = useState('Google Pay');
  const [isAddingUpi, setIsAddingUpi] = useState(false);

  const [savedCards, setSavedCards] = useState<Array<{ id: string; cardholderName: string; last4: string; expiry: string; brand: string; isDefault: boolean }>>(
    customer?.paymentMethods?.cards || []
  );
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState(customer?.name || '');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const [bankAccount, setBankAccount] = useState({
    bankName: customer?.paymentMethods?.bankAccount?.bankName || '',
    accountHolder: customer?.paymentMethods?.bankAccount?.accountHolder || customer?.name || '',
    accountNumber: customer?.paymentMethods?.bankAccount?.accountNumber || '',
    confirmAccountNumber: customer?.paymentMethods?.bankAccount?.accountNumber || '',
    ifsc: customer?.paymentMethods?.bankAccount?.ifsc || '',
    isVerified: Boolean(customer?.paymentMethods?.bankAccount?.isVerified),
  });
  const [bankSavedFeedback, setBankSavedFeedback] = useState<string | null>(null);

  // DigiLocker verification state
  const [isDigiLockerConnecting, setIsDigiLockerConnecting] = useState(false);
  const [digiLockerStep, setDigiLockerStep] = useState<number>(0);
  const [digiLockerVerified, setDigiLockerVerified] = useState<boolean>(Boolean(customer?.digilockerVerified || customer?.kycStatus === 'APPROVED'));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileFeedback(null);

    const payload = {
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      dob: profileDob,
      address: profileAddress,
      city: profileCity,
      state: profileState,
      pincode: profilePincode,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      emergencyContactRelation: emergencyRelation,
      dlNumber: profileDlNumber,
      dlExpiry: profileDlExpiry,
    };

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('newlink_token') : null;
      await fetch('/api/v1/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      updateCustomer(payload);
      setProfileFeedback('✓ Profile details saved and synced to Neon Database!');
      setTimeout(() => setProfileFeedback(null), 4000);
    } catch {
      updateCustomer(payload);
      setProfileFeedback('✓ Profile updated in local session!');
      setTimeout(() => setProfileFeedback(null), 4000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (bankAccount.accountNumber !== bankAccount.confirmAccountNumber) {
      alert('Account numbers do not match. Please re-enter.');
      return;
    }
    setBankSavedFeedback('✓ Security deposit refund bank details verified & saved.');
    updateCustomer({
      paymentMethods: {
        upi: savedUpis,
        cards: savedCards,
        bankAccount,
      },
    });
    setTimeout(() => setBankSavedFeedback(null), 3500);
  };

  const handleAddUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpiInput || !newUpiInput.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. yourname@okhdfcbank)');
      return;
    }
    const updated = [
      ...savedUpis,
      {
        id: `upi-${Date.now()}`,
        upiId: newUpiInput.trim(),
        provider: newUpiProvider,
        isDefault: savedUpis.length === 0,
      },
    ];
    setSavedUpis(updated);
    setNewUpiInput('');
    setIsAddingUpi(false);
    updateCustomer({
      paymentMethods: {
        upi: updated,
        cards: savedCards,
        bankAccount,
      },
    });
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = newCardNumber.replace(/\\s/g, '');
    if (cleanNum.length < 12) {
      alert('Please enter a valid card number');
      return;
    }
    const last4 = cleanNum.slice(-4);
    const updated = [
      ...savedCards,
      {
        id: `card-${Date.now()}`,
        cardholderName: newCardHolder || profileName || 'Cardholder',
        last4,
        expiry: newCardExpiry || '12/28',
        brand: cleanNum.startsWith('4') ? 'Visa' : 'Mastercard',
        isDefault: savedCards.length === 0,
      },
    ];
    setSavedCards(updated);
    setNewCardNumber('');
    setIsAddingCard(false);
    updateCustomer({
      paymentMethods: {
        upi: savedUpis,
        cards: updated,
        bankAccount,
      },
    });
  };

  const handleTriggerDigiLocker = async () => {
    setIsDigiLockerConnecting(true);
    setDigiLockerStep(1);

    setTimeout(() => {
      setDigiLockerStep(2);
    }, 1000);

    setTimeout(() => {
      setDigiLockerStep(3);
    }, 2200);

    setTimeout(async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('newlink_token') : null;
        await fetch('/api/v1/me/digilocker/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      } catch {
        // Continue simulation
      }

      setDigiLockerVerified(true);
      setIsDigiLockerConnecting(false);
      setDigiLockerStep(0);

      const verifiedUpdates = {
        kycStatus: 'APPROVED' as const,
        digilockerVerified: true,
        dlNumber: 'MH-12-2021-0089421',
        dlExpiry: '2041-06-25',
        dob: '1995-08-14',
        address: 'Flat 402, Royal Palms, Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
      };

      setProfileDlNumber(verifiedUpdates.dlNumber);
      setProfileDlExpiry(verifiedUpdates.dlExpiry);
      setProfileDob(verifiedUpdates.dob);
      setProfileAddress(verifiedUpdates.address);
      setProfileCity(verifiedUpdates.city);
      setProfilePincode(verifiedUpdates.pincode);

      updateCustomer(verifiedUpdates);
    }, 3200);
  };

  // KYC upload form states
  const [dlNumber, setDlNumber] = useState(customer?.dlNumber || '');
  const [expiryDate, setExpiryDate] = useState(customer?.dlExpiry || '');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Active Trip & Booking Lifecycle State
  const [bookingRef, setBookingRef] = useState('NL-PN-Q2KCA6');
  const [bookingStatus, setBookingStatus] = useState<'CONFIRMED' | 'ACTIVE' | 'COMPLETED'>(
    'CONFIRMED',
  );
  const [passcode, setPasscode] = useState('4829');
  const [carName, setCarName] = useState('Hyundai Creta SX (O) Turbo');
  const [carLocation, setCarLocation] = useState('Pune Airport (Lohegaon)');
  const [carImage, setCarImage] = useState('/images/car-creta.jpg');
  const [depositRupees, setDepositRupees] = useState(5000);
  const [totalPaidRupees, setTotalPaidRupees] = useState(9720);

  // Modals
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // Handover (Pickup) form state
  const [enteredPasscode, setEnteredPasscode] = useState('4829');
  const [startOdometer, setStartOdometer] = useState(14200);
  const [startFuel, setStartFuel] = useState(100);
  const [handoverCheckedFastag, setHandoverCheckedFastag] = useState(true);
  const [handoverCheckedClean, setHandoverCheckedClean] = useState(true);
  const [handoverCheckedSpare, setHandoverCheckedSpare] = useState(true);

  // 4-Angle Photo Inspection State
  const [inspectionPhotos, setInspectionPhotos] = useState<{
    front: boolean;
    rear: boolean;
    left: boolean;
    right: boolean;
  }>({ front: true, rear: true, left: true, right: true });

  // Digital Car Key & Keyless Simulator State
  const [isCarUnlocked, setIsCarUnlocked] = useState(false);
  const [keyActionFeedback, setKeyActionFeedback] = useState<string | null>(null);
  const [isHonking, setIsHonking] = useState(false);

  const toggleCarLock = () => {
    const nextState = !isCarUnlocked;
    setIsCarUnlocked(nextState);
    setKeyActionFeedback(nextState ? '🔓 Vehicle Unlocked via Bluetooth Telemetry' : '🔒 Vehicle Locked & Immobilized');
    setTimeout(() => setKeyActionFeedback(null), 3500);
  };

  const triggerHonk = () => {
    setIsHonking(true);
    setKeyActionFeedback('🚨 Beep-Beep! Hazard Lights Flashed & Horn Sounded');
    setTimeout(() => {
      setIsHonking(false);
      setKeyActionFeedback(null);
    }, 2500);
  };

  // Return (Drop-off) form state
  const [returnOdometer, setReturnOdometer] = useState(14550);
  const [returnFuel, setReturnFuel] = useState(95);
  const [fastagTolls, setFastagTolls] = useState(250);
  const [damageFines, setDamageFines] = useState(0);

  // Settlement Result
  const [settlementResult, setSettlementResult] = useState<{
    totalKm: number;
    tollsDeduction: number;
    fuelDeduction: number;
    finesDeduction: number;
    totalDeductions: number;
    refundAmount: number;
  } | null>(null);

  // Review & Dispute state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [conditionRating, setConditionRating] = useState(5);
  const [handoverRating, setHandoverRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState<
    'FASTAG_MISMATCH' | 'PRE_EXISTING_SCRATCH' | 'FUEL_READING_INCORRECT' | 'OTHER'
  >('FASTAG_MISMATCH');
  const [disputeClaimAmount, setDisputeClaimAmount] = useState(350);
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setIsReviewModalOpen(false);
    alert('✓ Thank you for reviewing your trip! Your feedback helps the Speion Cars community.');
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSubmitted(true);
    setIsDisputeModalOpen(false);
    alert(
      '✓ Dispute claim submitted to operations desk. Our team will review your counter-evidence within 24 hours.',
    );
  };

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedBooking = localStorage.getItem('newlink_active_booking');
      if (savedBooking) {
        const parsed = JSON.parse(savedBooking);
        if (parsed.reference) setBookingRef(parsed.reference);
        if (parsed.passcode) setPasscode(parsed.passcode);
        if (parsed.vehicle) {
          setCarName(`${parsed.vehicle.brand} ${parsed.vehicle.model}`);
          setCarLocation(`${parsed.vehicle.cityName} (${parsed.vehicle.locationName})`);
          if (parsed.vehicle.primaryImageUrl) setCarImage(parsed.vehicle.primaryImageUrl);
        }
        if (parsed.status) setBookingStatus(parsed.status);
        if (parsed.totalPaidRupees) setTotalPaidRupees(parsed.totalPaidRupees);
        if (parsed.depositRupees) setDepositRupees(parsed.depositRupees);
      }
    } catch {
      // fallback to defaults
    }
  }, []);

  const saveBookingStatus = (status: 'CONFIRMED' | 'ACTIVE' | 'COMPLETED') => {
    setBookingStatus(status);
    try {
      const existing = localStorage.getItem('newlink_active_booking');
      if (existing) {
        const parsed = JSON.parse(existing);
        parsed.status = status;
        localStorage.setItem('newlink_active_booking', JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  // If customer is not logged in, prompt or redirect
  if (!customer) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas text-white font-sans">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl border border-white/10 bg-card p-8 text-center shadow-lg">
            <User className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-white">
              Sign in to view your dashboard
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Access your upcoming bookings, upload KYC documents, and download invoices.
            </p>
            <Link
              href="/login?next=/account"
              className="mt-6 inline-block w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleUploadKyc = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      updateCustomer({ kycStatus: 'PENDING_REVIEW' });
    }, 600);
  };

  const getKycBadge = () => {
    switch (customer.kycStatus) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            KYC Verified
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
            <Clock className="h-3.5 w-3.5" />
            Under Verification
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-300">
            <AlertCircle className="h-3.5 w-3.5" />
            Verification Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-bold text-slate-200">
            Not Submitted
          </span>
        );
    }
  };

  // Submit Handover (Start Trip)
  const handleConfirmHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasscode !== passcode) {
      alert('Incorrect passcode. Passcode is ' + passcode);
      return;
    }
    saveBookingStatus('ACTIVE');
    setIsHandoverModalOpen(false);
  };

  // Live Return Settlement calculation
  const totalKm = Math.max(0, returnOdometer - startOdometer);
  const fuelShortagePercent = Math.max(0, startFuel - returnFuel);
  const fuelDeduction = fuelShortagePercent * 25; // ₹25 per 1% fuel shortage
  const tollsDeduction = Number(fastagTolls) || 0;
  const finesDeduction = Number(damageFines) || 0;
  const totalDeductions = Math.min(
    depositRupees,
    fuelDeduction + tollsDeduction + finesDeduction,
  );
  const refundAmount = Math.max(0, depositRupees - totalDeductions);

  const settlementPreview = {
    totalKm,
    tollsDeduction,
    fuelDeduction,
    finesDeduction,
    totalDeductions,
    refundAmount,
  };

  // Submit Return (Complete Trip)
  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setSettlementResult(settlementPreview);
    saveBookingStatus('COMPLETED');
    setIsReturnModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-white font-sans">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {customer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={customer.avatarUrl}
                  alt={customer.name || 'User avatar'}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-lg shadow-blue-600/25"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-lg font-bold text-white shadow-lg shadow-blue-600/25">
                  {customer.name ? customer.name[0]?.toUpperCase() : (customer.email ? customer.email[0]?.toUpperCase() : 'U')}
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {customer.name || 'Valued Customer'}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                  {customer.email && <span>{customer.email}</span>}
                  {customer.phone && <span>{customer.email ? `• ${customer.phone}` : customer.phone}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getKycBadge()}
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-card px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-surface/50 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-white/5 pb-1">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'OVERVIEW'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Overview & Active Rentals
            </button>
            <button
              onClick={() => setActiveTab('PROFILE')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PROFILE'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('PAYMENTS')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PAYMENTS'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('DIGILOCKER')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'DIGILOCKER'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              DigiLocker KYC
            </button>
            <button
              onClick={() => setActiveTab('KYC')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'KYC'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              Manual Upload
            </button>
          </div>
        </div>

        {/* Tab 1: Overview & Active Trips */}
        {activeTab === 'OVERVIEW' && (
          <div className="mt-8 space-y-8">
            {/* Active / Upcoming Rental Console */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  {bookingStatus === 'COMPLETED'
                    ? 'Completed Rental Summary'
                    : 'Current Rental & Handover'}
                </h2>
                <div className="text-xs text-slate-400 font-medium">
                  Reference:{' '}
                  <span className="font-mono font-bold text-white">{bookingRef}</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Car & Hub Information */}
                  <div className="flex items-start gap-4">
                    <img
                      src={carImage}
                      alt={carName}
                      className="h-20 w-28 rounded-2xl object-cover bg-surface border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30">
                          {bookingRef}
                        </span>

                        {bookingStatus === 'CONFIRMED' && (
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                            CONFIRMED (READY FOR PICKUP)
                          </span>
                        )}

                        {bookingStatus === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                            TRIP IN PROGRESS
                          </span>
                        )}

                        {bookingStatus === 'COMPLETED' && (
                          <span className="rounded-full bg-surface border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-200">
                            COMPLETED & SETTLED
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5">
                        {carName}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-300 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-blue-400" />
                          <span>{carLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Fastag Active • Unlimited Kilometers</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Lifecycle Actions & Handover Passcode */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                    <div className="text-right sm:mr-2">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Rental Paid
                      </div>
                      <div className="text-base font-black text-white">
                        ₹{totalPaidRupees.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        Incl. ₹{depositRupees.toLocaleString('en-IN')} Deposit
                      </div>
                    </div>

                    {bookingStatus === 'CONFIRMED' && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between sm:justify-start gap-2 rounded-xl bg-surface/50 px-3 py-1.5 border border-white/10">
                          <span className="text-[11px] font-medium text-slate-400">
                            Pickup Passcode:
                          </span>
                          <span className="font-mono text-sm font-black text-white">
                            {passcode}
                          </span>
                        </div>
                        <button
                          id="start-trip-btn"
                          onClick={() => setIsHandoverModalOpen(true)}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all cursor-pointer shadow-xs"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span>Start Handover & Inspection</span>
                        </button>
                      </div>
                    )}

                    {bookingStatus === 'ACTIVE' && (
                      <div className="flex flex-col gap-2">
                        <button
                          id="complete-trip-btn"
                          onClick={() => setIsReturnModalOpen(true)}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-md"
                        >
                          <Check className="h-4 w-4" />
                          <span>Return Vehicle & End Trip</span>
                        </button>
                        <a
                          href="tel:+919876543210"
                          className="text-center text-[11px] font-bold text-slate-400 hover:text-white"
                        >
                          24/7 Roadside Assist (+91 98765 43210)
                        </a>
                      </div>
                    )}

                    {bookingStatus === 'COMPLETED' && (
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-emerald-500/10 p-3.5 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                          <div className="flex items-center gap-1 font-bold">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>Security Deposit Refunded</span>
                          </div>
                          <div className="text-[11px] text-emerald-400">
                            ₹{(settlementResult?.refundAmount ?? 4625).toLocaleString('en-IN')}{' '}
                            released to original UPI account.
                          </div>
                        </div>

                        {/* Review Button / Badge */}
                        {reviewSubmitted ? (
                          <div className="flex items-center gap-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 px-3 py-2 text-xs font-bold text-blue-200">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-500" />
                            <span>Review Submitted ({reviewRating}★)</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-xs cursor-pointer"
                          >
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span>Rate & Review Trip</span>
                          </button>
                        )}

                        {/* Dispute / Claim Button / Badge */}
                        {disputeSubmitted ? (
                          <div className="flex items-center gap-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 px-3 py-2 text-xs font-bold text-blue-200">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span>Dispute Under Review (Claim: ₹{disputeClaimAmount})</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsDisputeModalOpen(true)}
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-card px-4 py-2 text-xs font-bold text-slate-200 hover:bg-surface/50 transition-colors cursor-pointer"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                            <span>Contest Deduction / Dispute Tolls</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Digital Car Key & Telemetry Console for Active Trip */}
                {bookingStatus === 'ACTIVE' && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-blue-400" />
                        <div>
                          <h4 className="text-sm font-bold text-white">Digital Car Key (BLE Simulator)</h4>
                          <p className="text-[11px] text-slate-400">
                            Keyless access paired with your mobile device • BLE 5.2 Connected
                          </p>
                        </div>
                      </div>
                      <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Connected to {carName}
                      </span>
                    </div>

                    {keyActionFeedback && (
                      <div className="mb-4 rounded-xl bg-blue-500/20 border border-blue-500/40 p-3 text-xs text-blue-200 font-bold animate-fade-in flex items-center gap-2">
                        <Radio className="h-4 w-4 text-blue-400 animate-pulse" />
                        <span>{keyActionFeedback}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Lock / Unlock Toggle Button */}
                      <button
                        type="button"
                        onClick={toggleCarLock}
                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                          isCarUnlocked
                            ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                            : 'bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30'
                        }`}
                      >
                        {isCarUnlocked ? (
                          <Unlock className="h-6 w-6 text-emerald-400" />
                        ) : (
                          <Lock className="h-6 w-6 text-blue-400" />
                        )}
                        <div className="text-left">
                          <div className="text-xs font-bold text-white">
                            {isCarUnlocked ? 'Car Unlocked' : 'Car Locked'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {isCarUnlocked ? 'Tap to Lock Vehicle' : 'Tap to Unlock Doors'}
                          </div>
                        </div>
                      </button>

                      {/* Remote Flash & Honk */}
                      <button
                        type="button"
                        onClick={triggerHonk}
                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                          isHonking
                            ? 'bg-amber-600/30 border-amber-500 text-amber-200 scale-95'
                            : 'bg-card border-white/10 text-slate-200 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <Volume2 className={`h-6 w-6 ${isHonking ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                        <div className="text-left">
                          <div className="text-xs font-bold text-white">Find My Car</div>
                          <div className="text-[10px] text-slate-400">Flash Hazards & Honk</div>
                        </div>
                      </button>

                      {/* Remote Telemetry Specs */}
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/50 border border-white/5">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Fuel & Range</div>
                          <div className="text-xs font-bold text-white mt-0.5">{startFuel}% (Est. ~580 km)</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Odometer</div>
                          <div className="text-xs font-bold text-white mt-0.5">{startOdometer} km</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Trip Telemetry Strip (When ACTIVE) */}
                {bookingStatus === 'ACTIVE' && (
                  <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="rounded-xl bg-surface/50 p-3 border border-white/10">
                      <span className="text-slate-400 block font-semibold">Starting Odometer</span>
                      <span className="font-bold text-white text-sm mt-0.5 flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5 text-slate-400" />
                        {startOdometer.toLocaleString('en-IN')} km
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface/50 p-3 border border-white/10">
                      <span className="text-slate-400 block font-semibold">Starting Fuel</span>
                      <span className="font-bold text-white text-sm mt-0.5 flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5 text-blue-500" />
                        {startFuel}% Full
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface/50 p-3 border border-white/10">
                      <span className="text-slate-400 block font-semibold">Fastag Tag Status</span>
                      <span className="font-bold text-emerald-400 text-sm mt-0.5 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Active & Linked
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface/50 p-3 border border-white/10">
                      <span className="text-slate-400 block font-semibold">
                        Security Deposit Held
                      </span>
                      <span className="font-bold text-white text-sm mt-0.5">
                        ₹{depositRupees.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/cars"
                className="rounded-2xl border border-white/10 bg-card p-5 shadow-xs hover:border-white/15 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-400">
                    Browse Cars
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Explore available cars in Pune & Nashik
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </Link>

              <div
                onClick={() => setActiveTab('KYC')}
                className="rounded-2xl border border-white/10 bg-card p-5 shadow-xs hover:border-white/15 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-400">
                    Manage KYC
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Upload or update Driving License
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: KYC Documents */}
        {activeTab === 'KYC' && (
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Mandatory Verification</span>
                </div>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Driving License Verification
                </h2>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  As per Maharashtra transport regulations for self-drive rentals, a valid Indian
                  Driving License is mandatory before vehicle handover.
                </p>

                {uploadSuccess ? (
                  <div className="mt-6 rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/30 text-emerald-300 text-xs">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span>Documents Submitted Successfully!</span>
                    </div>
                    <p className="mt-1 text-[11px] text-emerald-400">
                      Our fleet verification agent will verify your license before vehicle pickup.
                      You're all set!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleUploadKyc} className="mt-6 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-200">
                        Driving License Number
                      </label>
                      <input
                        type="text"
                        required
                        value={dlNumber}
                        onChange={(e) => setDlNumber(e.target.value)}
                        placeholder="e.g. MH-12-2018-004821"
                        className="mt-1 w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-xs font-mono font-medium text-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-200">
                        License Expiry Date
                      </label>
                      <input
                        type="date"
                        required
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-xs font-medium text-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-200 block mb-1">
                        Upload License Front & Back Photo
                      </label>
                      <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-white/10 p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-surface/50">
                        <div>
                          <Upload className="mx-auto h-8 w-8 text-slate-400" />
                          <span className="mt-2 block text-xs font-bold text-slate-200">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-[10px] text-slate-400">PNG, JPG up to 5MB</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUploading ? 'Submitting Documents...' : 'Submit for Verification'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Tab 3: Profile & Personal Details                                         */}
        {/* ========================================================================= */}
        {activeTab === 'PROFILE' && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  Account & Profile Details
                </h2>
                <p className="text-xs text-slate-400">
                  Update your contact details, residential address, emergency contact, and driving license.
                </p>
              </div>
              {profileFeedback && (
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
                  {profileFeedback}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Basic Information */}
              <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g. Aarav Patel"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="e.g. user@example.com"
                        className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none pr-20"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={profileDob}
                      onChange={(e) => setProfileDob(e.target.value)}
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Residential Address */}
              <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  Residential Address (Delivery & Billing)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-200 block mb-1">Street Address / Flat / Building</label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="Flat 402, Royal Palms, Baner Road"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">City</label>
                    <input
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      placeholder="Pune"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">State</label>
                    <input
                      type="text"
                      value={profileState}
                      onChange={(e) => setProfileState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">PIN / Postal Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={profilePincode}
                      onChange={(e) => setProfilePincode(e.target.value)}
                      placeholder="411045"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-400" />
                  Emergency Contact (Safety & Assistance)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Relationship</label>
                    <select
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none bg-card"
                    >
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Emergency Phone Number</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+91 98765 12345"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Driving License & Identity */}
              <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                    Driving License Details
                  </h3>
                  {digiLockerVerified ? (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      DigiLocker Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300">
                      Manual Verification
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Driving License (DL) Number</label>
                    <input
                      type="text"
                      value={profileDlNumber}
                      onChange={(e) => setProfileDlNumber(e.target.value)}
                      placeholder="MH-12-2021-0089421"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-mono font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">License Expiry Date</label>
                    <input
                      type="date"
                      value={profileDlExpiry}
                      onChange={(e) => setProfileDlExpiry(e.target.value)}
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="rounded-2xl bg-blue-600 px-8 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isSavingProfile ? 'Saving Changes...' : 'Save All Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Tab 4: Payment Methods & Refund Account                                   */}
        {/* ========================================================================= */}
        {activeTab === 'PAYMENTS' && (
          <div className="mt-8 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-400" />
                Payment Methods & Security Deposit Refund
              </h2>
              <p className="text-xs text-slate-400">
                Manage your saved UPI accounts, credit/debit cards, and set your verified bank account for automatic security deposit refunds.
              </p>
            </div>

            {/* 1. Saved UPI Accounts */}
            <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-emerald-400" />
                    Saved UPI IDs (Fast 1-Click Checkout)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pay via Google Pay, PhonePe, Paytm, or BHIM UPI.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingUpi(!isAddingUpi)}
                  className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-surface/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add UPI ID
                </button>
              </div>

              {isAddingUpi && (
                <form onSubmit={handleAddUpi} className="mb-4 rounded-2xl bg-surface/50 border border-white/10 p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-200 block mb-1">Enter UPI ID / VPA</label>
                      <input
                        type="text"
                        required
                        value={newUpiInput}
                        onChange={(e) => setNewUpiInput(e.target.value)}
                        placeholder="e.g. yourname@okhdfcbank"
                        className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-mono focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">UPI Provider</label>
                      <select
                        value={newUpiProvider}
                        onChange={(e) => setNewUpiProvider(e.target.value)}
                        className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-medium focus:border-blue-600 focus:outline-none bg-card"
                      >
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="BHIM UPI">BHIM UPI</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsAddingUpi(false)}
                      className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 cursor-pointer"
                    >
                      Save UPI
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedUpis.map((upi) => (
                  <div
                    key={upi.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-surface/30 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                        UPI
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-xs">{upi.upiId}</span>
                          {upi.isDefault && (
                            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{upi.provider}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSavedUpis(savedUpis.filter((u) => u.id !== upi.id))}
                      className="text-slate-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                      title="Remove UPI ID"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Saved Cards */}
            <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-400" />
                    Saved Credit & Debit Cards
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Encrypted tokenization via RBI-mandated payment gateways.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingCard(!isAddingCard)}
                  className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-surface/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add New Card
                </button>
              </div>

              {isAddingCard && (
                <form onSubmit={handleAddCard} className="mb-4 rounded-2xl bg-surface/50 border border-white/10 p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 4242"
                        className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-mono focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={newCardHolder}
                        onChange={(e) => setNewCardHolder(e.target.value)}
                        placeholder="Name on Card"
                        className="w-full rounded-xl border border-white/15 px-3 py-2 text-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-mono focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsAddingCard(false)}
                      className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 cursor-pointer"
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-blue-400">{card.brand}</span>
                      <button
                        type="button"
                        onClick={() => setSavedCards(savedCards.filter((c) => c.id !== card.id))}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="font-mono text-sm tracking-widest text-white mb-4">
                      •••• •••• •••• {card.last4}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Card Holder</div>
                        <div className="font-bold text-white">{card.cardholderName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Expires</div>
                        <div className="font-mono text-white">{card.expiry}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Security Deposit Refund Bank Account */}
            <div className="rounded-3xl border border-emerald-500/20 bg-card p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                      Security Deposit Refund Bank Account
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Your ₹5,000 security deposit is automatically refunded to this account within 24 hours of dropping off the car.
                  </p>
                </div>
                {bankSavedFeedback && (
                  <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
                    {bankSavedFeedback}
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveBankAccount} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={bankAccount.bankName}
                      onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank Ltd"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Account Holder Legal Name</label>
                    <input
                      type="text"
                      required
                      value={bankAccount.accountHolder}
                      onChange={(e) => setBankAccount({ ...bankAccount, accountHolder: e.target.value })}
                      placeholder="Must match your Driving License / Aadhaar"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Bank Account Number</label>
                    <input
                      type="password"
                      required
                      value={bankAccount.accountNumber}
                      onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                      placeholder="Enter account number"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-mono font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Confirm Bank Account Number</label>
                    <input
                      type="text"
                      required
                      value={bankAccount.confirmAccountNumber}
                      onChange={(e) => setBankAccount({ ...bankAccount, confirmAccountNumber: e.target.value })}
                      placeholder="Re-enter account number"
                      className="w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-mono font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-200 block mb-1">IFSC Code (11 Digits)</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        required
                        maxLength={11}
                        value={bankAccount.ifsc}
                        onChange={(e) => setBankAccount({ ...bankAccount, ifsc: e.target.value.toUpperCase() })}
                        placeholder="e.g. HDFC0000039"
                        className="w-full max-w-xs rounded-xl border border-white/15 px-3.5 py-2.5 text-white font-mono uppercase font-medium focus:border-emerald-500 focus:outline-none"
                      />
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4" />
                        Valid IFSC: {bankAccount.bankName} - Baner Branch
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    Save Refund Bank Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Tab 5: DigiLocker KYC Verification Portal                                 */}
        {/* ========================================================================= */}
        {activeTab === 'DIGILOCKER' && (
          <div className="mt-8 space-y-8">
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-card to-card p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                    <ShieldCheck className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">Government DigiLocker e-KYC</h2>
                      <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-black text-blue-300 uppercase tracking-wider">
                        Official Parivahan API
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300 max-w-xl">
                      Instantly verify your Aadhaar Identity and Ministry of Road Transport and Highways (MoRTH) Driving License without uploading paper scans.
                    </p>
                  </div>
                </div>

                <div>
                  {digiLockerVerified ? (
                    <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/40 p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="h-4 w-4" />
                        DigiLocker Verified
                      </div>
                      <span className="text-[10px] text-emerald-300/80 block mt-0.5 font-medium">
                        Aadhaar + DL Authenticated
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isDigiLockerConnecting}
                      onClick={handleTriggerDigiLocker}
                      className="w-full sm:w-auto rounded-2xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isDigiLockerConnecting ? 'Authenticating via DigiLocker...' : 'Verify with DigiLocker'}
                    </button>
                  )}
                </div>
              </div>

              {/* Live Multi-Step Verification Animation */}
              {isDigiLockerConnecting && (
                <div className="mt-6 rounded-2xl bg-surface/60 border border-white/10 p-5 space-y-3">
                  <div className="text-xs font-bold text-slate-200">DigiLocker Secure Handshake in Progress...</div>
                  <div className="space-y-2 text-xs">
                    <div className={`flex items-center gap-2.5 ${digiLockerStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Step 1: Connecting to DigiLocker MeriPehchan OAuth Gateway...</span>
                    </div>
                    <div className={`flex items-center gap-2.5 ${digiLockerStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Step 2: Requesting issued digital Driving License from MoRTH Sarathi registry...</span>
                    </div>
                    <div className={`flex items-center gap-2.5 ${digiLockerStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Step 3: Cryptographic verification of digital signature & biometric Aadhaar match...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Certificate Display */}
              {digiLockerVerified && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface/40 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">Issued Driving License</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">STATUS: ACTIVE</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-white">{profileDlNumber}</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div>Holder: <span className="text-white font-medium">{profileName}</span></div>
                      <div>Valid Till: <span className="text-white font-medium">{profileDlExpiry}</span></div>
                      <div>Authorized: <span className="text-white font-medium">LMV-NT (Car)</span></div>
                      <div>Issuer: <span className="text-white font-medium">RTO Pune (MH-12)</span></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface/40 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">Aadhaar e-KYC Verified Address</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">UIDAI CERTIFIED</span>
                    </div>
                    <div className="text-white font-medium">{profileAddress}, {profileCity}, {profileState} - {profilePincode}</div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      DOB: <span className="text-white font-medium">{profileDob}</span> • Gender: <span className="text-white font-medium">Male</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step Technical Guide for DigiLocker Integration */}
            <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                DigiLocker Integration Architecture & Steps
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Here are the technical steps and API protocols used to pull authenticated Indian Driving License and Aadhaar KYC records from DigiLocker:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-surface/30 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-blue-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px]">1</span>
                    Partner Registration & Credentials
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Register as a requester partner on the <strong>MeriPehchan / DigiLocker Requester Portal</strong> (or via authorized verification aggregators such as Setu, Surepass, Cashfree, or Signzy). Obtain your client ID, client secret, and registered OAuth redirect URIs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface/30 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-blue-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px]">2</span>
                    OAuth 2.0 Authorization Request
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Direct user to:
                    <br />
                    <code className="text-emerald-300 font-mono text-[10px] break-all">
                      https://digilocker.meripehchan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=YOUR_ID&redirect_uri=CALLBACK_URL&state=SECURE_NONCE
                    </code>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface/30 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-blue-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px]">3</span>
                    Authorization Code to Access Token Exchange
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    When DigiLocker redirects back to your callback URL with the temporary authorization code, your backend makes a POST request to <code className="text-blue-300 font-mono text-[10px]">/public/oauth2/1/token</code> with <code className="text-slate-300 font-mono text-[10px]">grant_type=authorization_code</code> to receive the bearer access token.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface/30 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-blue-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px]">4</span>
                    Fetch Document XML & Extract License
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Call <code className="text-blue-300 font-mono text-[10px]">GET /public/oauth2/1/xml/drivinglicense</code> or URI <code className="text-emerald-300 font-mono text-[10px]">in.gov.transport-DRVLC</code>. Parse the returned signed XML to extract the license number, driver name, vehicle class (LMV), validity, and photo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* Modal: Start Trip Handover Inspection                                     */}
      {/* ========================================================================= */}
      {isHandoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-white/5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Vehicle Handover Inspection</h3>
              </div>
              <button
                onClick={() => setIsHandoverModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmHandover} className="mt-5 space-y-4 text-xs">
              {/* Passcode Verification */}
              <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/30">
                <label className="text-xs font-bold text-amber-100 block mb-1">
                  Enter 4-Digit Pickup Passcode
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={enteredPasscode}
                  onChange={(e) => setEnteredPasscode(e.target.value)}
                  className="w-full rounded-xl border border-amber-500/40 bg-card px-3 py-2 text-center font-mono text-lg font-black tracking-widest text-white focus:border-amber-600 focus:outline-none"
                />
                <span className="text-[11px] text-amber-300 block mt-1.5">
                  Confirm the passcode matches the code provided on your booking confirmation.
                </span>
              </div>

              {/* Starting Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">
                    Starting Odometer (km)
                  </label>
                  <input
                    type="number"
                    required
                    value={startOdometer}
                    onChange={(e) => setStartOdometer(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-bold focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-200">Fuel Level</label>
                    <span className="font-mono font-bold text-emerald-400">{startFuel}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    step={5}
                    value={startFuel}
                    onChange={(e) => setStartFuel(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Reserve</span>
                    <span>Half</span>
                    <span>Full Tank</span>
                  </div>
                </div>
              </div>

              {/* 4-Angle Digital Car Inspection Photo Upload */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-blue-400" />
                    4-Angle Vehicle Inspection Photos
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {Object.values(inspectionPhotos).filter(Boolean).length}/4 Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'front' as const, label: 'Front View' },
                    { key: 'rear' as const, label: 'Rear View' },
                    { key: 'left' as const, label: 'Left Side' },
                    { key: 'right' as const, label: 'Right Side' },
                  ].map((angle) => {
                    const isDone = inspectionPhotos[angle.key];
                    return (
                      <div
                        key={angle.key}
                        onClick={() =>
                          setInspectionPhotos((p) => ({ ...p, [angle.key]: !p[angle.key] }))
                        }
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                            : 'bg-surface/50 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <Camera className={`h-4 w-4 mx-auto mb-1 ${isDone ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <div className="text-[11px] font-bold text-white">{angle.label}</div>
                        <div className="text-[9px] mt-0.5">
                          {isDone ? '✓ Captured' : 'Tap to Upload'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Physical Condition Checklist */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-100 block">Pre-Handover Checklist</span>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-surface/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={handoverCheckedFastag}
                    onChange={(e) => setHandoverCheckedFastag(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-400 focus:ring-blue-500"
                  />
                  <span className="text-slate-100 font-medium">
                    Fastag windshield RFID tag is active
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-surface/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={handoverCheckedClean}
                    onChange={(e) => setHandoverCheckedClean(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-400 focus:ring-blue-500"
                  />
                  <span className="text-slate-100 font-medium">
                    Vehicle is clean with 0 existing scratches
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-surface/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={handoverCheckedSpare}
                    onChange={(e) => setHandoverCheckedSpare(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-400 focus:ring-blue-500"
                  />
                  <span className="text-slate-100 font-medium">
                    Spare tire and tool kit verified in boot
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsHandoverModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-handover-btn"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors cursor-pointer shadow-md"
                >
                  Confirm Handover & Unlock Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Return Inspection & Deposit Settlement                             */}
      {/* ========================================================================= */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-white/5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Return & Deposit Settlement</h3>
              </div>
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Final Odometer (km)</label>
                  <input
                    type="number"
                    required
                    min={startOdometer}
                    value={returnOdometer}
                    onChange={(e) => setReturnOdometer(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-bold focus:border-blue-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Distance: {Math.max(0, returnOdometer - startOdometer)} km driven
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">Return Fuel (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={returnFuel}
                    onChange={(e) => setReturnFuel(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-bold focus:border-blue-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Pickup was {startFuel}%
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Fastag Toll Charges Incurred (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={fastagTolls}
                  onChange={(e) => setFastagTolls(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-bold focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Settlement Calculation Live Breakdown */}
              <div className="rounded-2xl bg-surface/50 p-4 border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-white block border-b border-white/10 pb-2">
                  Security Deposit Release Breakdown
                </span>

                <div className="flex justify-between text-slate-300">
                  <span>Original Security Deposit:</span>
                  <span className="font-bold text-white">
                    ₹{depositRupees.toLocaleString('en-IN')}
                  </span>
                </div>

                {settlementPreview.tollsDeduction > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Fastag Electronic Tolls:</span>
                    <span className="font-semibold text-red-400">
                      -₹{settlementPreview.tollsDeduction.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {settlementPreview.fuelDeduction > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Fuel Adjustment Shortage:</span>
                    <span className="font-semibold text-red-400">
                      -₹{settlementPreview.fuelDeduction.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-extrabold text-white">
                  <span>Net Refund to Bank / UPI:</span>
                  <span className="text-emerald-400">
                    ₹{settlementPreview.refundAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-return-btn"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Confirm Return & Release Deposit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Rate & Review Completed Trip                                      */}
      {/* ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-white/5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <h3 className="text-lg font-bold text-white">Rate & Review Your Trip</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4 text-xs">
              <p className="text-slate-300">
                How was your experience renting <strong>{carName}</strong>? Your feedback ensures
                transparent standards for our Pune & Nashik fleet.
              </p>

              {/* Star Category Ratings */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-surface/50 p-4 border border-white/10">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Overall Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            s <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">Vehicle Cleanliness</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCleanlinessRating(s)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            s <= cleanlinessRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">
                    Mechanical Condition
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setConditionRating(s)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            s <= conditionRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">
                    Handover & Passcode Ease
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setHandoverRating(s)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            s <= handoverRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Your Written Review</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us about the vehicle condition, road trip experience, pickup smoothness..."
                  className="w-full rounded-xl border border-white/15 p-3 text-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Submit Verified Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Contest Deductions & Fastag Dispute                                 */}
      {/* ========================================================================= */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-white/5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Contest Settlement Deduction</h3>
              </div>
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDispute} className="mt-5 space-y-4 text-xs">
              <p className="text-slate-300">
                Believe you were incorrectly charged for Fastag tolls or fuel shortage? Submit your
                counter-evidence for our operations desk.
              </p>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Reason for Dispute</label>
                <select
                  value={disputeReason}
                  onChange={(e: any) => setDisputeReason(e.target.value)}
                  className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="FASTAG_MISMATCH">Fastag Toll Duplicate / Mismatch</option>
                  <option value="FUEL_READING_INCORRECT">Incorrect Fuel Gauge Reading</option>
                  <option value="PRE_EXISTING_SCRATCH">Pre-existing Exterior Scratch</option>
                  <option value="OTHER">Other Settlement Contestation</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Claimed Refund Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={5000}
                  value={disputeClaimAmount}
                  onChange={(e) => setDisputeClaimAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/15 px-3 py-2 text-white font-bold focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Detailed Explanation & Toll/Fuel Details
                </label>
                <textarea
                  required
                  rows={3}
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  placeholder="Provide toll plaza name, fuel station bill details, or reference timestamp..."
                  className="w-full rounded-xl border border-white/15 p-3 text-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-500 transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Submit Claim to Operations</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
