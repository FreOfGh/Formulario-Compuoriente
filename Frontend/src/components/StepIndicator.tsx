import { CheckCircle, User, Phone, Users, FileText } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

const icons = [User, Phone, Users, FileText];

export default function StepIndicator({
  steps,
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="font-bold text-gray-800 mb-4 text-lg">Proceso de Inscripción</h2>
      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = icons[step.id - 1];
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : isCompleted
                  ? "bg-green-50"
                  : "bg-gray-50"
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isCompleted
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span
                    className={`font-medium ${
                      isActive
                        ? "text-blue-800"
                        : isCompleted
                        ? "text-green-800"
                        : "text-gray-600"
                    }`}
                  >
                    Paso {step.id}: {step.title}
                  </span>
                  {isCompleted && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Completado
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}