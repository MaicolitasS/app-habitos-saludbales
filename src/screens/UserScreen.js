import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const UserScreen = () => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerBackground}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={100} color={colors.iluminado} />
                    </View>
                    <Text style={styles.userName}>Usuario Saludable</Text>
                    <Text style={styles.userEmail}>usuario@habitos.com</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Tu Progreso Semanal</Text>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
                            <Ionicons name="flame" size={24} color={colors.exito} />
                        </View>
                        <Text style={styles.statNumber}>7</Text>
                        <Text style={styles.statLabel}>Días seguidos</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                            <Ionicons name="checkmark-done" size={24} color={colors.informacion} />
                        </View>
                        <Text style={styles.statNumber}>42</Text>
                        <Text style={styles.statLabel}>Hábitos listos</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Insignias Recientes</Text>
                
                <View style={styles.badgesContainer}>
                    <View style={styles.badgeItem}>
                        <Ionicons name="medal" size={40} color="#fbbf24" />
                        <Text style={styles.badgeText}>Primer Paso</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Ionicons name="water" size={40} color="#60a5fa" />
                        <Text style={styles.badgeText}>Hidratado</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Ionicons name="bicycle" size={40} color="#f87171" />
                        <Text style={styles.badgeText}>Activo</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.principal,
    },
    headerBackground: {
        backgroundColor: colors.variante2,
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    profileSection: {
        alignItems: 'center',
    },
    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: colors.variante4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.iluminado,
        marginBottom: 15,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.iluminado,
    },
    userEmail: {
        fontSize: 16,
        color: colors.delicado,
        marginTop: 5,
        opacity: 0.8,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.oscuro,
        marginBottom: 15,
        marginTop: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.iluminado,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.oscuro,
    },
    statLabel: {
        fontSize: 14,
        color: colors.subtitilo,
        marginTop: 5,
        textAlign: 'center',
    },
    badgesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.iluminado,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 30,
    },
    badgeItem: {
        alignItems: 'center',
    },
    badgeText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        color: colors.subtitilo,
    }
});

export default UserScreen;
