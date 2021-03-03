import Text from './text'
import Input from './input'
import Radio from './radio'
import Checkbox from './checkbox'
import Select from './select'
import Datetime from './datetime'
import Image from './image'
import Button from './button.vue'
import Line from './line.vue'
import Editor from './editor.vue'
import Imagepicker from './imagepicker.vue'
import Drcode from './drcode.vue'
import Operator from './operator.vue'

export default {
  [Text.name]: Text,
  [Input.name]: Input,
  [Radio.name]: Radio,
  [Checkbox.name]: Checkbox,
  [Select.name]: Select,
  [Datetime.name]: Datetime,
  [Image.name]: Image,
  [Button.name]: Button,
  [Line.name]: Line,
  [Editor.name]: Editor,
  [Imagepicker.name]: Imagepicker,
  [Drcode.name]: Drcode,
  [Operator.name]: Operator
}