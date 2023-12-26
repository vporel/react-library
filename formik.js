import { InputAdornment, } from "@mui/material"
/**
 * 
 * @param {*} values 
 * @param {...} validators {property: val => void}
 * @returns 
 */
export function formikValidate(values, ...validators){
    const errors = {}
    for(const _validators of validators){
        for(const property in _validators){
            if(property in values){
                const error = _validators[property](values[property], values)
                if(error != "") errors[property] = error
            }
        }
    }
    return errors
}

export function formikFieldProps(formikProps, field, label, options = {}){
    const {defaultHelperText, startIconName, endIconName} = options
    return {
        label, name: field, value: formikProps.values[field], onChange: formikProps.handleChange, onBlur: formikProps.handleBlur,  helperText: (formikProps.errors[field] && formikProps.touched[field]) ? formikProps.errors[field] : defaultHelperText, error: formikProps.errors[field] && formikProps.touched[field],
        InputProps: {
            startAdornment: startIconName && <InputAdornment position="start"><i className={`fas fa-${startIconName}`}></i></InputAdornment>,
            endAdornment: endIconName && <InputAdornment position="end"><i className={`fas fa-${endIconName}`}></i></InputAdornment>
        }
    }
}