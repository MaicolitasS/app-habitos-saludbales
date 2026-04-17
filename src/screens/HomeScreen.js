import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const HomeScreen = () => {
    const [habits, setHabits] = useState([
        { id: '1', title: 'Beber 2 litros de agua', completed: false },
        { id: '2', title: 'Hacer 30 min de ejercicio', completed: true },
        { id: '3', title: 'Leer un libro', completed: false },
    ]);
    const [newHabit, setNewHabit] = useState('');

    const addHabit = () => {
        if (newHabit.trim() === '') return;
        const habit = { id: Date.now().toString(), title: newHabit, completed: false };
        setHabits([habit, ...habits]);
        setNewHabit('');
    };

    const toggleHabit = (id) => {
        setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    const renderHabitItem = ({ item }) => (
        <View style={styles.habitCard}>
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => toggleHabit(item.id)}
            >
                <Ionicons
                    name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                    size={28}
                    color={item.completed ? colors.exito : colors.subtitilo}
                />
            </TouchableOpacity>

            <Text style={[styles.habitTitle, item.completed && styles.habitTitleCompleted]}>
                {item.title}
            </Text>

            <TouchableOpacity onPress={() => deleteHabit(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color={colors.alerta} />
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mis Hábitos</Text>
                <Text style={styles.headerSubtitle}>Construye tu mejor versión</Text>
            </View>

            <View style={styles.inputSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un nuevo hábito..."
                    placeholderTextColor={colors.subtitilo}
                    value={newHabit}
                    onChangeText={setNewHabit}
                />
                <TouchableOpacity style={styles.addButton} onPress={addHabit}>
                    <Ionicons name="add" size={28} color={colors.iluminado} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={habits}
                keyExtractor={(item) => item.id}
                renderItem={renderHabitItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="leaf-outline" size={64} color={colors.suave} />
                        <Text style={styles.emptyText}>Aún no tienes hábitos registrados.</Text>
                        <Text style={styles.emptySubtext}>¡Comienza agregando uno nuevo arriba!</Text>
                    </View>
                }
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.principal,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.variante1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.iluminado,
    },
    headerSubtitle: {
        fontSize: 16,
        color: colors.delicado,
        marginTop: 5,
        opacity: 0.9,
    },
    inputSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: colors.iluminado,
        height: 55,
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        color: colors.oscuro,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    addButton: {
        width: 55,
        height: 55,
        backgroundColor: colors.variante3,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        shadowColor: colors.variante3,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.iluminado,
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: colors.variante4,
    },
    checkboxContainer: {
        marginRight: 15,
    },
    habitTitle: {
        flex: 1,
        fontSize: 16,
        color: colors.oscuro,
        fontWeight: '500',
    },
    habitTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.subtitilo,
        fontStyle: 'italic',
    },
    deleteButton: {
        padding: 8,
        backgroundColor: '#fee2e2',
        borderRadius: 10,
        marginLeft: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 18,
        color: colors.oscuro,
        fontWeight: '600',
    },
    emptySubtext: {
        marginTop: 10,
        fontSize: 14,
        color: colors.subtitilo,
        textAlign: 'center',
    }
});

export default HomeScreen;
