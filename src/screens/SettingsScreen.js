import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut, auth } from "../services/firebaseService";
import { useNavigation } from "@react-navigation/native";
import colors from "../constants/colors";

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = async() => {
        try {
           setLoading(true);
           await signOut(auth);
           Alert.alert("Has cerrado sesión correctamente",[
            {text: "OK", onPress: () => navigation.reset({index:0, routes: [{name:"login"}]})}
           ]);
        } catch (error) {
            console.log("Error al cerrar sesión: ", error);
            Alert.alert("Error al cerrar sesión ...😢", "Intenta de nuevo más tarde");
        } finally {
            setLoading(false);
        }
    };

    const renderSettingItem = (icon, title, color = colors.variante2) => (
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <Text style={styles.settingTitle}>{title}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtitilo} />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ajustes</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cuenta</Text>
                <View style={styles.card}>
                    {renderSettingItem("person-outline", "Editar Perfil", colors.variante3)}
                    <View style={styles.divider} />
                    {renderSettingItem("notifications-outline", "Notificaciones", colors.advertencia)}
                    <View style={styles.divider} />
                    {renderSettingItem("lock-closed-outline", "Privacidad y Seguridad", colors.variante1)}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General</Text>
                <View style={styles.card}>
                    {renderSettingItem("moon-outline", "Modo Oscuro", colors.oscuro)}
                    <View style={styles.divider} />
                    {renderSettingItem("language-outline", "Idioma", colors.informacion)}
                    <View style={styles.divider} />
                    {renderSettingItem("help-circle-outline", "Ayuda y Soporte", colors.variante2)}
                </View>
            </View>

            <View style={styles.logoutSection}>
                <TouchableOpacity 
                    style={styles.logoutBtn} 
                    activeOpacity={0.8} 
                    onPress={handleLogout} 
                    disabled={loading}
                >
                    <Ionicons name="log-out-outline" size={24} color={colors.alerta} style={styles.logoutIcon} />
                    <Text style={styles.logoutBtnText}>
                        {loading ? "Cerrando sesión..." : "Cerrar sesión"}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.versionText}>Versión 1.0.0</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.principal,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.iluminado,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.oscuro,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.subtitilo,
        marginBottom: 10,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: colors.iluminado,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.iluminado,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    settingTitle: {
        flex: 1,
        fontSize: 16,
        color: colors.oscuro,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginLeft: 70,
    },
    logoutSection: {
        padding: 20,
        marginTop: 30,
        marginBottom: 40,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        borderWidth: 1.5,
        borderColor: '#fecaca',
        borderRadius: 16,
        paddingVertical: 16,
        shadowColor: colors.alerta,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    logoutIcon: {
        marginRight: 10,
    },
    logoutBtnText: {
        color: colors.alerta,
        fontWeight: 'bold',
        fontSize: 18,
    },
    versionText: {
        textAlign: 'center',
        color: colors.subtitilo,
        marginTop: 20,
        fontSize: 14,
    }
});

export default SettingsScreen;
