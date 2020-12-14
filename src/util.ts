import { Validation } from 'vuelidate'

export function getValidationMessage(validation: Validation): string {
  if (validation && validation.$error) {
    if (validation.hasOwnProperty('required') && !validation['required']) {
      return 'Toto pole je vyžadováno.'
    } else if (validation.hasOwnProperty('minLength') && !validation['minLength']) {
      return `Toto pole musí obsahovat minimálně ${validation.$params.minLength.min} ${getWordShape(validation.$params.minLength.min)}.`
    } else if (validation.hasOwnProperty('maxLength') && !validation['maxLength']) {
      return `Toto pole může obsahovat maximálně ${validation.$params.maxLength.max} ${getWordShape(validation.$params.maxLength.max)}.`
    } else if (validation.hasOwnProperty('samePassword') && !validation['samePassword']) {
      return 'Hesla nejsou stejná.'
    } else if (validation.hasOwnProperty('sameAs') && !validation['sameAs']) {
      return validation.$params.sameAs.message
    } else if (validation.hasOwnProperty('numeric') && !validation['numeric']) {
      return 'Toto pole může obsahovat pouze číslice.'
    } else if (validation.hasOwnProperty('alphaNum') && !validation['alphaNum']) {
      return 'Toto pole může obsahovat pouze alfanumerické znaky.'
    } else if (validation.hasOwnProperty('email') && !validation['email']) {
      return 'Email není není validní.'
    }
  }

  return ''
}

function getWordShape(num: number): string {
  if (num === 1) {
    return 'znak'
  } else if (num < 5) {
    return 'znaky'
  } else {
    return 'znaků'
  }
}
