import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export interface OptionType {
  value: string;
  label: string;
  hideQuestions?: string[];  // IDs der Fragen, die ausgeblendet werden sollen, wenn diese Option ausgewählt wird
}

interface OptionsSelectorProps {
  options: OptionType[];
  onSelect: (value: string) => void;
  selectedValues: string | string[] | null;
  isMultipleChoice?: boolean;
}

const OptionsSelector: React.FC<OptionsSelectorProps> = ({
  options,
  onSelect,
  selectedValues,
  isMultipleChoice = false
}) => {
  const isSelected = (value: string): boolean => {
    if (selectedValues === null) return false;
    return Array.isArray(selectedValues)
      ? selectedValues.includes(value)
      : selectedValues === value;
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <View className="space-y-3 w-full">
        {options.map(({ value, label }) => (
         <Button
          key={value}
          variant={isSelected(value) ? "default" : "outline"}
          onPress={() => onSelect(value)}
          className="py-3 items-center justify-center"
        >
          <Text className="text-center" numberOfLines={0}>
            {label}
          </Text>
        </Button>
        ))}
      </View>
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    paddingVertical: 4,
    paddingBottom: 0,
  },
  bottomSpacer: {
    height: 0,
  },
});

export default OptionsSelector;
