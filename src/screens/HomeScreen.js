import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../constants/colors";
import sqliteService from "../services/sqliteService";

const HomeScreen = () => {
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState('');
    const [loading, setLoading] = useState(true);

    // Cargar hábitos desde SQLite cada vez que la pantalla toma foco
    useFocusEffect(
        useCallback(() => {
            cargarHabitos();
        }, [])
    );

    const cargarHabitos = () => {
        try {
            const rows = sqliteService.obtenerHabitos();
            const parsed = rows.map(h => ({
                ...h,
                completed: h.completado === 1,
            }));
            setHabits(parsed);
        } catch (e) {
            console.error('Error cargando hábitos:', e);
        } finally {
            setLoading(false);
        }
    };

    const addHabit = () => {
        const titulo = newHabit.trim();
        if (!titulo) return;
        try {
            sqliteService.agregarHabito(titulo);
            setNewHabit('');
            cargarHabitos();
        } catch (e) {
            Alert.alert('Error', 'No se pudo agregar el hábito');
        }
    };

    const toggleHabit = (id, currentCompleted) => {
        try {
            sqliteService.actualizarHabito(id, !currentCompleted);
            setHabits(prev =>
                prev.map(h => h.id === id ? { ...h, completed: !h.completed, completado: h.completado === 1 ? 0 : 1 } : h)
            );
        } catch (e) {
            Alert.alert('Error', 'No se pudo actualizar el hábito');
        }
    };

    const deleteHabit = (id) => {
        Alert.alert(
            'Eliminar hábito',
            '¿Estás seguro de que quieres eliminar este hábito?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar', style: 'destructive',
                    onPress: () => {
                        try {
                            sqliteService.eliminarHabito(id);
                            setHabits(prev => prev.filter(h => h.id !== id));
                        } catch (e) {
                            Alert.alert('Error', 'No se pudo eliminar el hábito');
                        }
                    }
                }
            ]
        );
    };

    const completados = habits.filter(h => h.completed).length;

    const renderHabitItem = ({ item }) => (
        <View style={styles.habitCard}>
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => toggleHabit(item.id, item.completed)}
            >
                <Ionicons
                    name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                    size={28}
                    color={item.completed ? colors.exito : colors.subtitilo}
                />
            </TouchableOpacity>

            <Text style={[styles.habitTitle, item.completed && styles.habitTitleCompleted]}>
                {item.titulo}
            </Text>

            <TouchableOpacity onPress={() => deleteHabit(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color={colors.alerta} />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.variante3} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mis Hábitos</Text>
                <Text style={styles.headerSubtitle}>Construye tu mejor versión</Text>
                {habits.length > 0 && (
                    <View style={styles.progressRow}>
                        <Text style={styles.progressText}>
                            {completados} de {habits.length} completados hoy
                        </Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${(completados / habits.length) * 100}%` }]} />
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.inputSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un nuevo hábito..."
                    placeholderTextColor={colors.subtitilo}
                    value={newHabit}
                    onChangeText={setNewHabit}
                    onSubmitEditing={addHabit}
                    returnKeyType="done"
                />
                <TouchableOpacity style={styles.addButton} onPress={addHabit}>
                    <Ionicons name="add" size={28} color={colors.iluminado} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={habits}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHabitItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="leaf-outline" size={64} color={colors.subtitilo} />
                        <Text style={styles.emptyText}>Aún no tienes hábitos registrados.</Text>
                        <Text style={styles.emptySubtext}>¡Comienza agregando uno nuevo arriba!</Text>
                    </View>
                }
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.principal },
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
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: colors.iluminado },
    headerSubtitle: { fontSize: 16, color: colors.delicado, marginTop: 5, opacity: 0.9 },
    progressRow: { marginTop: 12 },
    progressText: { fontSize: 13, color: colors.delicado, marginBottom: 6, opacity: 0.9 },
    progressBarBg: {
        height: 6, backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 10, overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%', backgroundColor: colors.iluminado,
        borderRadius: 10,
    },
    inputSection: {
        flexDirection: 'row', paddingHorizontal: 20,
        paddingVertical: 20, alignItems: 'center',
    },
    input: {
        flex: 1, backgroundColor: colors.iluminado, height: 55,
        borderRadius: 15, paddingHorizontal: 20, fontSize: 16,
        color: colors.oscuro, borderWidth: 1, borderColor: '#e2e8f0',
        elevation: 2,
    },
    addButton: {
        width: 55, height: 55, backgroundColor: colors.variante3,
        borderRadius: 15, justifyContent: 'center', alignItems: 'center',
        marginLeft: 15, elevation: 4,
    },
    listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
    habitCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.iluminado,
        borderRadius: 16, padding: 15, marginBottom: 15, elevation: 2,
        borderLeftWidth: 5, borderLeftColor: colors.variante4,
    },
    checkboxContainer: { marginRight: 15 },
    habitTitle: { flex: 1, fontSize: 16, color: colors.oscuro, fontWeight: '500' },
    habitTitleCompleted: {
        textDecorationLine: 'line-through', color: colors.subtitilo, fontStyle: 'italic',
    },
    deleteButton: {
        padding: 8, backgroundColor: '#fee2e2', borderRadius: 10, marginLeft: 10,
    },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
    emptyText: { marginTop: 20, fontSize: 18, color: colors.oscuro, fontWeight: '600' },
    emptySubtext: { marginTop: 10, fontSize: 14, color: colors.subtitilo, textAlign: 'center' },
});

export default HomeScreen;
