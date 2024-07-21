import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";


interface SelectMultipleProps {
    options: string[];
    selectedValues: string[];
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectMultiple: React.FC<SelectMultipleProps> = ({ options, selectedValues, setSelectedValues }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const toggleOption = (option: string) => {
        if (selectedValues.includes(option)) {
            setSelectedValues(selectedValues.filter((value) => value.toLowerCase() !== option.toLowerCase()));
        } else {
            setSelectedValues([...selectedValues, option.toLowerCase()]);
        }
    };

    const renderItem = ({ item }: { item: string }) => {
        const isSelected = selectedValues.includes(item.toLowerCase());

        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: isSelected ? '#4CAF50' : 'transparent',
                    borderRadius: 5,
                    marginVertical: 5,
                }}
                onPress={() => toggleOption(item)}
            >
                <Text style={{ marginRight: 10, color: isSelected ? 'white' : 'black' }}>{item}</Text>
                {isSelected && <Ionicons name="checkmark" size={20} color="white" />}
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginBottom: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Sélectionner</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 50 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedValues([])}>
                            <Text>Effacer tout</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={options}
                        renderItem={renderItem}
                        keyExtractor={(item) => item}
                        extraData={selectedValues}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});

export default SelectMultiple;