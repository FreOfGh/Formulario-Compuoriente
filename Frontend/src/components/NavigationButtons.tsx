import { ChevronLeft, ChevronRight, CheckCircle, Send } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  isSubmitting,
  isValid,
}: NavigationButtonsProps) {
  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 hidden sm:block">
            Paso {currentStep} de {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={onNext}
              disabled={!isValid}
              className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continuar</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Realizar pago</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progreso Móvil */}
      <div className="mt-6 sm:hidden">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso</span>
          <span className="font-bold">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}