import { useRef, type ChangeEvent } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MAX_NOTE_IMAGES } from '../../constants/noteImages';
import { saveNoteImage } from '../../storage/noteImages';
import { formStyles } from '../form/formStyles';
import { textFont, theme } from '../../theme';
import { showValidationAlert } from '../../utils/validation';
import { NoteImageThumb } from './NoteImageThumb';

type NoteImagePickerProps = {
  imageIds: string[];
  onChange: (imageIds: string[]) => void;
};

export function NoteImagePicker({ imageIds, onChange }: NoteImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handlePickPress() {
    if (imageIds.length >= MAX_NOTE_IMAGES) {
      showValidationAlert(`每則筆記最多 ${MAX_NOTE_IMAGES} 張圖片。`);
      return;
    }

    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showValidationAlert('請選擇圖片檔案。');
      return;
    }

    try {
      const imageId = await saveNoteImage(file, file.type);
      onChange([...imageIds, imageId]);
    } catch {
      showValidationAlert('圖片儲存失敗，請再試一次。');
    }
  }

  function handleRemove(imageId: string) {
    onChange(imageIds.filter((id) => id !== imageId));
  }

  return (
    <View style={styles.wrap}>
      <Text style={formStyles.fieldLabel}>圖片</Text>
      <Text style={formStyles.fieldHint}>最多 {MAX_NOTE_IMAGES} 張</Text>

      {imageIds.length > 0 ? (
        <View style={styles.thumbRow}>
          {imageIds.map((imageId) => (
            <NoteImageThumb key={imageId} imageId={imageId} onRemove={() => handleRemove(imageId)} />
          ))}
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={handlePickPress}
        style={({ pressed }) => [styles.pickButton, pressed && styles.pickPressed]}
      >
        <Text style={styles.pickButtonText}>選擇圖片</Text>
      </Pressable>

      <input
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        type="file"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 4
  },
  thumbRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10
  },
  pickButton: {
    alignItems: 'center',
    borderColor: theme.border,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 44,
    paddingHorizontal: 14
  },
  pickPressed: {
    opacity: 0.75
  },
  pickButtonText: {
    color: theme.cyan,
    fontFamily: textFont,
    fontSize: 14,
    fontWeight: '600'
  }
});
