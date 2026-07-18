import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { formatISODate } from '../../utils/date';
import { formStyles } from './formStyles';

type FormDateFieldProps = Omit<TextInputProps, 'placeholder'> & {
  label?: string;
};

export function FormDateField({
  label = '日期',
  value,
  ...inputProps
}: FormDateFieldProps) {
  const exampleDate = formatISODate(new Date());

  return (
    <View>
      <Text style={formStyles.fieldLabel}>{label}</Text>
      <Text style={formStyles.fieldHint}>格式 YYYY-MM-DD</Text>
      <TextInput
        placeholder={exampleDate}
        placeholderTextColor={inputProps.placeholderTextColor}
        style={formStyles.input}
        value={value}
        {...inputProps}
      />
    </View>
  );
}
