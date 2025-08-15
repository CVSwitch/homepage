"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { API_CONFIG } from "@/config/api";
import axios from "axios";
import { extractText } from "@/lib/extractText";

interface AIWriterButtonProps {
    currentText: string;
    onAccept: (newText: string) => void;
    fieldKey: string; // Unique identifier for this field (e.g., "personalInfo_summary", "workExperience_0_description")
    className?: string;
    onErrorChange?: (hasError: boolean) => void; // Optional callback to notify parent about error state
}

export function AIWriterButton({
    currentText,
    onAccept,
    fieldKey,
    className = "",
    onErrorChange
}: AIWriterButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const resumeId = searchParams.get('resume_id');

    const clearError = () => {
        if (errorMessage) {
            setErrorMessage(null);
            onErrorChange?.(false);
        }
    };

    const setError = (message: string) => {
        setErrorMessage(message);
        onErrorChange?.(true);
    };

    const handleAIWrite = async () => {
        clearError();

        if (!currentText?.trim()) {
            setError("Please add some text first before using AI Writer");
            return;
        }

        if (!user?.uid) {
            setError("Please sign in to use AI Writer");
            return;
        }

        setIsLoading(true);

        try {
            // Extract plain text from HTML for the API call
            const plainText = extractText(currentText);

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AI_WRITE}`,
                {
                    user_id: user.uid,
                    resume_id: resumeId || "",
                    text: plainText
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // console.log('AI Writer response:', response.data);

            if (response.data?.data?.data?.rewritten_text) {
                let rewrittenText = response.data.data.data.rewritten_text;

                // Parse the JSON string if it's in JSON format
                try {
                    const parsedResponse = JSON.parse(rewrittenText);
                    if (parsedResponse.text) {
                        rewrittenText = parsedResponse.text;
                    }
                } catch {
                    // If parsing fails, use the original text (in case API format changes)
                    // console.log('Could not parse rewritten_text as JSON, using as-is');
                }

                // console.log('Processed rewritten text:', rewrittenText);

                // Store suggestion in session storage
                const suggestionData = {
                    original: currentText,
                    rewritten: rewrittenText,
                    fieldKey: fieldKey
                };
                sessionStorage.setItem(`aiWriter_${fieldKey}`, JSON.stringify(suggestionData));

                setSuggestion(rewrittenText);
                setShowSuggestion(true);
                // console.log('AI Writer suggestion set for field:', fieldKey);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error with AI Writer:', error);
            setError('Error improving text. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = () => {
        if (suggestion) {
            onAccept(suggestion);
            setShowSuggestion(false);
            setSuggestion(null);
            clearError();
            // Clear from session storage
            sessionStorage.removeItem(`aiWriter_${fieldKey}`);
            // console.log('AI suggestion accepted for field:', fieldKey);
        }
    };

    const handleReject = () => {
        setShowSuggestion(false);
        setSuggestion(null);
        clearError();
        // Clear from session storage
        sessionStorage.removeItem(`aiWriter_${fieldKey}`);
        // console.log('AI suggestion rejected for field:', fieldKey);
    };

    return (
        <div className="space-y-3">
            {/* AI Writer Button */}
            <Button
                type="button"
                onClick={handleAIWrite}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className={`flex items-center gap-2 text-purple-600 border-purple-300 hover:bg-purple-50 ${className}`}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4" />
                )}
                {isLoading ? 'Improving...' : 'AI Writer'}
            </Button>

            {/* Error Message */}
            {errorMessage && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                    {errorMessage}
                </div>
            )}

            {/* AI Suggestion */}
            {showSuggestion && suggestion && (
                <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-purple-900">
                            ✨ AI Improved Text
                        </h4>
                    </div>

                    <div className="mb-3">
                        <div
                            className="text-purple-800 text-sm leading-relaxed bg-white p-3 rounded border"
                            dangerouslySetInnerHTML={{ __html: suggestion }}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            onClick={handleAccept}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                        </Button>
                        <Button
                            type="button"
                            onClick={handleReject}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}