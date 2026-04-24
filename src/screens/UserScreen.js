import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { auth, onAuthStateChanged } from "../services/firebaseService";
import colors from "../constants/colors";
import sqliteService from "../services/sqliteService";

const UserScreen = () => {
    const [user, setUser] = useState(null);
    const [totalHabitos, setTotalHabitos] = useState(0);
    const [completadosHoy, setCompletadosHoy] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Cada vez que el usuario vuelve a esta pantalla, recarga foto y stats
    useFocusEffect(
        useCallback(() => {
            // Recargar el usuario actual para obtener photoURL actualizado
            if (auth.currentUser) {
                auth.currentUser.reload().then(() => {
                    setUser({ ...auth.currentUser });
                });
            }
            cargarStats();
        }, [])
    );

    const cargarStats = () => {
        try {
            const habitos = sqliteService.obtenerHabitos();
            setTotalHabitos(habitos.length);
            setCompletadosHoy(habitos.filter(h => h.completado === 1).length);
        } catch (e) {
            console.error('Error cargando stats:', e);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.variante3} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerBackground}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {user?.photoURL ? (
                            <Image
                                source={{ uri: user.photoURL }}
                                style={styles.avatarImage}
                            />
                        ) : (
                            <Ionicons name="person-circle" size={100} color={colors.iluminado} />
                        )}
                    </View>
                    <Text style={styles.userName}>{user?.displayName || 'Usuario'}</Text>
                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Tu Progreso</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
                            <Ionicons name="checkmark-done" size={24} color={colors.exito} />
                        </View>
                        <Text style={styles.statNumber}>{completadosHoy}</Text>
                        <Text style={styles.statLabel}>Completados hoy</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                            <Ionicons name="list" size={24} color={colors.informacion} />
                        </View>
                        <Text style={styles.statNumber}>{totalHabitos}</Text>
                        <Text style={styles.statLabel}>Hábitos totales</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Insignias</Text>

                <View style={styles.badgesContainer}>
                    <View style={styles.badgeItem}>
                        <Ionicons name="medal" size={40} color={totalHabitos >= 1 ? "#fbbf24" : '#d1d5db'} />
                        <Text style={styles.badgeText}>Primer Paso</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Ionicons name="water" size={40} color={completadosHoy >= 1 ? "#60a5fa" : '#d1d5db'} />
                        <Text style={styles.badgeText}>Constante</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Ionicons name="bicycle" size={40} color={totalHabitos >= 5 ? "#f87171" : '#d1d5db'} />
                        <Text style={styles.badgeText}>Activo</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.principal },
    headerBackground: {
        backgroundColor: colors.variante2, paddingTop: 60, paddingBottom: 40,
        borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
        alignItems: 'center', elevation: 8,
    },
    profileSection: { alignItems: 'center' },
    avatarContainer: {
        width: 110, height: 110, borderRadius: 55, backgroundColor: colors.variante4,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 4, borderColor: colors.iluminado, marginBottom: 15,
        overflow: 'hidden',
    },
    avatarImage: { width: 110, height: 110, borderRadius: 55 },
    userName: { fontSize: 24, fontWeight: 'bold', color: colors.iluminado },
    userEmail: { fontSize: 16, color: colors.delicado, marginTop: 5, opacity: 0.8 },
    content: { padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.oscuro, marginBottom: 15, marginTop: 10 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    statCard: {
        flex: 1, backgroundColor: colors.iluminado, borderRadius: 20,
        padding: 20, marginHorizontal: 5, alignItems: 'center', elevation: 3,
    },
    iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    statNumber: { fontSize: 28, fontWeight: 'bold', color: colors.oscuro },
    statLabel: { fontSize: 14, color: colors.subtitilo, marginTop: 5, textAlign: 'center' },
    badgesContainer: {
        flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.iluminado,
        borderRadius: 20, padding: 20, elevation: 3, marginBottom: 30,
    },
    badgeItem: { alignItems: 'center' },
    badgeText: { marginTop: 8, fontSize: 12, fontWeight: '600', color: colors.subtitilo },
});

export default UserScreen;
