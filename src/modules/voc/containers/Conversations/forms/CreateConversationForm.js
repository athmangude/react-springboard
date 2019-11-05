import { Form } from 'mobx-react-form';
import validatorjs from 'validatorjs';

export default class CreateConversationForm extends Form {

    plugins() {
      return { dvr: validatorjs };
    }

    options() {
      return {
        validateOnChange: true,
      };
    }

  setup() {
      return {
        fields: [{
          name: 'objective',
          rules: 'required|string',
          default: 'basic',
        },
        {
          name: 'title',
          label: 'Title',
          placeholder: 'Enter a Title',
          rules: 'required|string|between:5,25',
        },
        {
          name: 'questions',
          rules: 'required:array',
          default: [],
        },
        {
          name: 'audience',
          label: 'Audience',
          rules: 'required_unless:objective,basic',
        },
        {
          name: 'target',
          label: 'Target',
          rules: 'required_unless:objective,basic|numeric|min:1',
          default: 100,
        },
        {
          name: 'schedule',
          rules: 'required|string',
          default: 'immediately',
        },
        ],
      };
    }
}
