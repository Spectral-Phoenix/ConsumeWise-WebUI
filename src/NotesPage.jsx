import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian", icon: "🥕" },
  { id: "vegan", label: "Vegan", icon: "🌱" },
  { id: "gluten-free", label: "Gluten-free", icon: "🌾" },
  { id: "dairy-free", label: "Dairy-free", icon: "🥛" },
  { id: "kosher", label: "Kosher", icon: "✡️" },
  { id: "halal", label: "Halal", icon: "☪️" },
];

export default function NotesPage() {
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [allergies, setAllergies] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const storedFormData = localStorage.getItem("notesFormData");
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      setDietaryPreferences(parsedFormData.dietaryPreferences);
      setAllergies(parsedFormData.allergies);
      setSpecialRequirements(parsedFormData.specialRequirements);
      setIsSubmitted(true);
      setInitialData(parsedFormData);
    }
  }, []);

  const handleDietaryToggle = (id) => {
    setDietaryPreferences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    handleChange();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      dietaryPreferences,
      allergies,
      specialRequirements,
    };

    localStorage.setItem("notesFormData", JSON.stringify(formData));

    console.log("Form data stored in localStorage:", formData);

    setIsSubmitted(true);
    setInitialData(formData);
  };

  const handleChange = () => {
    const currentData = {
      dietaryPreferences,
      allergies,
      specialRequirements,
    };

    if (JSON.stringify(currentData) !== JSON.stringify(initialData)) {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle> </CardTitle>
        <CardDescription> </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Dietary Preferences</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {dietaryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                      dietaryPreferences.includes(option.id)
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() => handleDietaryToggle(option.id)}
                  >
                    <span
                      className="text-3xl"
                      role="img"
                      aria-label={option.label}
                    >
                      {option.icon}
                    </span>
                    <span className="font-medium text-sm">{option.label}</span>
                    {dietaryPreferences.includes(option.id) && (
                      <Check
                        className="absolute top-2 right-2 text-primary"
                        size={16}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                placeholder="e.g., Peanuts, Shellfish"
                value={allergies}
                onChange={(e) => {
                  setAllergies(e.target.value);
                  handleChange();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="special-requirements">
                Special Requirements
              </Label>
              <Textarea
                id="special-requirements"
                placeholder="Any additional dietary needs or preferences"
                value={specialRequirements}
                onChange={(e) => {
                  setSpecialRequirements(e.target.value);
                  handleChange();
                }}
              />
            </div>
          </div>
        </form>
        {isSubmitted && (
          <p className="text-gray-600 mt-4">
            User information submitted successfully.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full"
          disabled={isSubmitted}
        >
          {isSubmitted ? "Submitted" : "Submit"}
        </Button>
      </CardFooter>
    </div>
  );
}