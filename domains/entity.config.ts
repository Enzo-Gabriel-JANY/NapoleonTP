import FormBataille from '~/domains/bataille/FormBataille.vue'
import {batailleFormDefaultValueConst} from '~/domains/bataille/batailleFormDefaultValue.const'

export const entityConfig = {
  formComponent: {
    batailles: FormBataille
  },
  defaultValues: {
    batailles: batailleFormDefaultValueConst,
  },
  title: {
    batailles: 'Bataille'
  },
  titleEntity: {
    batailles: 'bataille'
  },
}
