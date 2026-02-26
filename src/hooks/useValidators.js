let valid = true;
let error = null;

export const errors = {
    email: "Invalid email format",
    name: "Name cannot be empty",
    category: "Category cannot be empty"
};

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase()) && email.trim().length > 0;
}

export function validateName(name) {
  return name.trim().length > 0;
}

export function validateCategory(category) {
  return category.trim().length > 0;
}

export default function useValidators(data) {
    
    function validateFirstStep() {
        
        if (data.category !== undefined && !validateCategory(data.category)) {
            valid = false;
            error = "category";
            return false;
        }

        return true;
    }

    function validateSecondStep() {
        if (data.name !== undefined && !validateName(data.name)) {
            valid = false;
            error = "name";
            return false;
        }

        if (data.email !== undefined && !validateEmail(data.email)) {
            valid = false;
            error = "email";
            return false;
        }

        return true;
    }

    function validateAll() {
        return validateFirstStep() && validateSecondStep();
    }

  return { validateFirstStep, validateSecondStep, validateAll, valid, error };
}