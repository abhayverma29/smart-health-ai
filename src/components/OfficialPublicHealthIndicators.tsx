import React, { useState } from "react";
import { BookOpen, ShieldAlert, CheckCircle, Database, TrendingUp, Info } from "lucide-react";

interface OfficialPublicHealthIndicatorsProps {
  language: "en" | "hi" | "mr";
  onApplyThresholdCalibration?: (medId: string, customThreshold: number) => void;
}

export const OfficialPublicHealthIndicators: React.FC<OfficialPublicHealthIndicatorsProps> = ({
  language,
  onApplyThresholdCalibration
}) => {
  const [activeTab, setActiveTab] = useState<"nfhs" | "census" | "calibration">("nfhs");

  const labels = {
    en: {
      title: "Census & NFHS-5 Public Domain Reference Baseline",
      subtitle: "Official datasets aligned with Pune District health, demographics, and clinical vulnerability metrics.",
      nfhsTab: "NFHS-5 Factsheet Indicators",
      censusTab: "Census Demographic Baseline",
      calibrationTab: "Ground-Truth Threshold Calibration",
      source: "Sourced from data.gov.in, Ministry of Health and Family Welfare (MoHFW) and Census of India.",
      applyAlert: "Calibrate Threshold",
      calibratedSuccess: "Threshold successfully calibrated based on regional NFHS-5 risk profile!"
    },
    hi: {
      title: "जनगणना और एनएफएचएस-5 आधिकारिक संदर्भ डेटाबेस",
      subtitle: "पुणे जिला स्वास्थ्य, जनसांख्यिकी और नैदानिक संवेदनशीलता मेट्रिक्स से संबंधित आधिकारिक सरकारी डेटा।",
      nfhsTab: "NFHS-5 फैक्टशीट संकेतक",
      censusTab: "जनगणना जनसांख्यिकी",
      calibrationTab: "आधिकारिक डेटा आधारित थ्रेशोल्ड अंशांकन",
      source: "data.gov.in, स्वास्थ्य और परिवार कल्याण मंत्रालय (MoHFW) और भारत की जनगणना से प्राप्त आंकड़े।",
      applyAlert: "थ्रेशोल्ड कैलिब्रेट करें",
      calibratedSuccess: "क्षेत्रीय एनएफएचएस-5 जोखिम प्रोफाइल के आधार पर दवा थ्रेशोल्ड सफलतापूर्वक कैलिब्रेट किया गया!"
    },
    mr: {
      title: "जनगणना आणि एनएफएचएस-५ अधिकृत संदर्भ डेटाबेस",
      subtitle: "पुणे जिल्हा आरोग्य, लोकसंख्याशास्त्र आणि वैद्यकीय संवेदनशीलता मेट्रिक्सशी संबंधित अधिकृत शासकीय माहिती.",
      nfhsTab: "NFHS-5 फॅक्टशीट निर्देशक",
      censusTab: "जनगणना लोकसंख्याशास्त्र",
      calibrationTab: "अधिकृत डेटा आधारित थ्रेशोल्ड कॅलिब्रेशन",
      source: "data.gov.in, आरोग्य आणि कुटुंब कल्याण मंत्रालय (MoHFW) आणि भारताच्या जनगणनेवरून गोळा केलेली माहिती.",
      applyAlert: "थ्रेशोल्ड कॅलिब्रेट करा",
      calibratedSuccess: "प्रादेशिक एनएफएचएस-५ जोखीम प्रोफाइलच्या आधारे औषध थ्रेशोल्ड यशस्वीरित्या कॅलिब्रेट केले गेले!"
    }
  }[language];

  // Official National Family Health Survey - 5 (NFHS-5, 2019-21) data for Pune District, Maharashtra
  const nfhsIndicators = [
    {
      category: "Maternal & Child Health",
      name: "Institutional Births (%)",
      value: "99.4%",
      stateAvg: "95.5%",
      status: "Exceptional",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      description: "Mothers delivering in health centers or hospitals. Minimizes obstetric risk."
    },
    {
      category: "Immunization & Childhood Diseases",
      name: "Children 12-23 months fully immunized (%)",
      value: "78.4%",
      stateAvg: "73.5%",
      status: "On Track",
      statusColor: "text-blue-600 bg-blue-50 border-blue-200",
      description: "Received BCG, measles, and 3 doses each of DPT and polio vaccine."
    },
    {
      category: "Nutritional Status of Children",
      name: "Stunted children under 5 years (%)",
      value: "29.8%",
      stateAvg: "35.2%",
      status: "Requires Attention",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200",
      description: "Height-for-age indicator. Signals chronic undernutrition and stunting."
    },
    {
      category: "Nutritional Status of Children",
      name: "Wasted children under 5 years (%)",
      value: "18.5%",
      stateAvg: "25.6%",
      status: "Requires Attention",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200",
      description: "Weight-for-height indicator. Signals acute malnutrition or severe wasting."
    },
    {
      category: "Anemia Prevalence",
      name: "Anemic Pregnant Women (15-49 years) (%)",
      value: "45.2%",
      stateAvg: "47.1%",
      status: "High Risk",
      statusColor: "text-rose-600 bg-rose-50 border-rose-200 animate-pulse",
      description: "Hemoglobin level < 11.0 g/dL. Directly informs Iron / Folic Acid stock buffers."
    },
    {
      category: "Anemia Prevalence",
      name: "Anemic Children (6-59 months) (%)",
      value: "61.4%",
      stateAvg: "68.9%",
      status: "High Risk",
      statusColor: "text-rose-600 bg-rose-50 border-rose-200 animate-pulse",
      description: "Extremely high pediatric vulnerability. Demands pediatric multi-vitamin & iron reserves."
    }
  ];

  // Official Census of India (Demographic) profile for Pune District
  const censusDemographics = [
    {
      name: "Total Population",
      value: "9,429,408",
      detail: "2nd most populous district in Maharashtra.",
      subtext: "Urban: 61.0% | Rural: 39.0%"
    },
    {
      name: "Decadal Population Growth (2001-2011)",
      value: "30.37%",
      detail: "Massive urban migration and fringe expansions.",
      subtext: "Sustains heavy clinical footfall pressure."
    },
    {
      name: "Average Literacy Rate",
      value: "86.15%",
      detail: "Male: 90.84% | Female: 81.05%",
      subtext: "Correlates with high OPD booking digitisation potential."
    },
    {
      name: "Sex Ratio (Females per 1000 Males)",
      value: "915",
      detail: "Child Sex Ratio (0-6 yrs) stands at 883.",
      subtext: "Requires active maternal screening focus."
    },
    {
      name: "Population Density",
      value: "603 / km²",
      detail: "State Average: 365 per km².",
      subtext: "High proximity increases communicable disease outbreak risks."
    }
  ];

  // Calibration rules connecting ground truth to live dashboard threshold recommendations
  const calibrationRules = [
    {
      medId: "crit-1",
      medicineName: "Iron & Folic Acid Tablets",
      basisIndicator: "Anemic Pregnant Women (45.2%)",
      currentThreshold: "25 units",
      calibratedThreshold: "60 units",
      rationale: "Because 45.2% of pregnant women in Pune District suffer from anemia, the standard threshold is chronically low. Calibrating the minimum safety threshold to 60 units triggers emergency procurements before complete exhaustion."
    },
    {
      medId: "crit-2",
      medicineName: "Pediatric Iron Drops (Malt)",
      basisIndicator: "Anemic Children (61.4%)",
      currentThreshold: "20 units",
      calibratedThreshold: "50 units",
      rationale: "Pediatric anemia is at a critical 61.4%. Standard buffers must be doubled to protect children under 5 years from micro-nutrient stock-outs during seasonal clinical surges."
    },
    {
      medId: "crit-3",
      medicineName: "ORS Hydration Powder Packs",
      basisIndicator: "Wasted Children under 5 yrs (18.5%)",
      currentThreshold: "20 units",
      calibratedThreshold: "40 units",
      rationale: "Acute wasting increases diarrhea vulnerability. Calibrate higher ORS thresholds to prevent acute dehydration mortality across remote primary care centers."
    }
  ];

  const handleApplyCalibration = (medId: string, val: number, name: string) => {
    if (onApplyThresholdCalibration) {
      onApplyThresholdCalibration(medId, val);
    }
    window.alert(`[${labels.applyAlert} Successful]\n\nCalibrated safety threshold for ${name} to ${val} units based on local district indicators!`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6" id="official-indicators-section">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-100 gap-4">
        <div className="space-y-1 font-sans">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-indigo-200/50 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-3 w-3" />
              Public Domain Ground Truth
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-200/50 font-mono uppercase">
              NFHS-5 & Census
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-800">{labels.title}</h3>
          <p className="text-xs text-slate-400">{labels.subtitle}</p>
        </div>

        {/* Source indicator */}
        <div className="text-[10px] text-slate-400 font-mono italic max-w-xs text-right">
          {labels.source}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 font-sans text-xs gap-4 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab("nfhs")}
          className={`pb-3 font-bold transition-all relative outline-none cursor-pointer ${
            activeTab === "nfhs" ? "text-indigo-600 font-black border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {labels.nfhsTab}
        </button>
        <button
          onClick={() => setActiveTab("census")}
          className={`pb-3 font-bold transition-all relative outline-none cursor-pointer ${
            activeTab === "census" ? "text-indigo-600 font-black border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {labels.censusTab}
        </button>
        <button
          onClick={() => setActiveTab("calibration")}
          className={`pb-3 font-bold transition-all relative outline-none cursor-pointer flex items-center gap-1.5 ${
            activeTab === "calibration" ? "text-indigo-600 font-black border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {labels.calibrationTab}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[220px]">
        {activeTab === "nfhs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
            {nfhsIndicators.map((ind, i) => (
              <div key={i} className="bg-slate-50/50 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-wide">{ind.category}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold border ${ind.statusColor}`}>
                      {ind.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-xs">{ind.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{ind.description}</p>
                </div>
                
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-black text-indigo-600">{ind.value}</span>
                    <span className="text-[9px] text-slate-400 block font-medium">Pune District Fact</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-500">{ind.stateAvg}</span>
                    <span className="text-[9px] text-slate-400 block font-medium">MH State Avg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "census" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-sans">
            {censusDemographics.map((dem, i) => (
              <div key={i} className="bg-indigo-900 text-white rounded-2xl p-4 flex flex-col justify-between space-y-4">
                <div>
                  <h5 className="text-[9px] text-indigo-300 uppercase font-black tracking-wider font-mono">{dem.name}</h5>
                  <div className="text-xl font-black text-white mt-1">{dem.value}</div>
                </div>
                <div className="space-y-1 border-t border-indigo-800/60 pt-2 text-[10px]">
                  <p className="text-slate-200 font-medium leading-tight">{dem.detail}</p>
                  <p className="text-indigo-300 font-mono leading-tight">{dem.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "calibration" && (
          <div className="space-y-4 font-sans">
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs text-amber-800 leading-relaxed">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold block">AI Supply Chain Recommendation Engine</strong>
                This panel enables district administrators to synchronize medical safety thresholds with official, public health indicators of Pune district. For example, because pregnant women anemia is extraordinarily high in Pune, standard safety stock minimum thresholds can be upgraded instantly to prevent sudden depletion cascades.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {calibrationRules.map((rule, i) => (
                <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl space-y-4 hover:border-slate-300 transition">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-rose-500 font-mono uppercase bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md w-fit">
                      🛑 Aligns with {rule.basisIndicator}
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-xs">🩸 {rule.medicineName}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{rule.rationale}</p>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Standard min</span>
                      <span className="text-slate-500 font-bold">{rule.currentThreshold}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Calibrated min</span>
                      <span className="text-indigo-600 font-extrabold text-sm">{rule.calibratedThreshold}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyCalibration(rule.medId, parseInt(rule.calibratedThreshold), rule.medicineName)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase font-mono py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                    {labels.applyAlert}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
