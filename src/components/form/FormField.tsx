import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { formStyles } from './formStyles';

type FormFieldProps = TextInputProps & {
  label: string;
  hint?: string;
  multiline?: boolean;
};

export const FormField = forwardRef<TextInput, FormFieldProps>(function FormField(
  { label, hint, multiline = false, style, ...inputProps },
  ref
) {
  return (
    <View>
      <Text style={formStyles.fieldLabel}>{label}</Text>
      {hint ? <Text style={formStyles.fieldHint}>{hint}</Text> : null}
      <TextInput
        ref={ref}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor={inputProps.placeholderTextColor}
        style={[formStyles.input, multiline && formStyles.textArea, style]}
        {...inputProps}
      />
    </View>
  );
});
