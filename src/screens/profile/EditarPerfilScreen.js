import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView,
    Platform, Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
    updateProfile, updatePassword,
    EmailAuthProvider, reauthenticateWithCredential
} from "firebase/auth";
import { auth } from "../../services/firebaseService";
import { pickImage, uploadImageToCloudinary } from "../../services/cloudinaryService";
import colors from "../../constants/colors";

const EditarPerfilScreen = () => {
    const navigation = useNavigation();
    const user = auth.currentUser;

    const [nombre, setNombre] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
    const [passwordActual, setPasswordActual] = useState('');
    const [passwordNueva, setPasswordNueva] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loadingNombre, setLoadingNombre] = useState(false);
    const [loadingFoto, setLoadingFoto] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [showPassActual, setShowPassActual] = useState(false);
    const [showPassNueva, setShowPassNueva] = useState(false);
    const [showPassConfirm, setShowPassConfirm] = useState(false);

    const handleCambiarFoto = async () => {
        try {
            const uri = await pickImage();
            if (!uri) return;

            setLoadingFoto(true);
            const url = await uploadImageToCloudinary(uri);
            await updateProfile(user, { photoURL: url });
            setPhotoURL(url);
            Alert.alert('✅ Éxito', 'Foto de perfil actualizada correctamente');
        } catch (e) {
            console.error('Error subiendo foto:', e);
            Alert.alert('Error', 'No se pudo subir la foto. Verifica tu conexión e intenta de nuevo.');
        } finally {
            setLoadingFoto(false);
        }
    };

    const guardarNombre = async () => {
        if (!nombre.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return;
        }
        if (nombre.trim() === user?.displayName) {
            Alert.alert('Sin cambios', 'El nombre es igual al actual');
            return;
        }
        try {
            setLoadingNombre(true);
            await updateProfile(user, { displayName: nombre.trim() });
            Alert.alert('✅ Éxito', 'Nombre actualizado correctamente');
        } catch (e) {
            Alert.alert('Error', 'No se pudo actualizar el nombre');
        } finally {
            setLoadingNombre(false);
        }
    };

    const cambiarPassword = async () => {
        if (!passwordActual || !passwordNueva || !passwordConfirm) {
            Alert.alert('Error', 'Completa todos los campos de contraseña');
            return;
        }
        if (passwordNueva !== passwordConfirm) {
            Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
            return;
        }
        if (passwordNueva.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (passwordNueva === passwordActual) {
            Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
            return;
        }
        try {
            setLoadingPassword(true);
            const credential = EmailAuthProvider.credential(user.email, passwordActual);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, passwordNueva);
            setPasswordActual('');
            setPasswordNueva('');
            setPasswordConfirm('');
            Alert.alert('✅ Éxito', 'Contraseña actualizada correctamente');
        } catch (e) {
            if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
                Alert.alert('Error', 'La contraseña actual es incorrecta');
            } else {
                Alert.alert('Error', 'No se pudo cambiar la contraseña. Intenta de nuevo.');
            }
        } finally {
            setLoadingPassword(false);
        }
    };

    const renderPasswordInput = (placeholder, value, onChange, show, setShow) => (
        <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={colors.variante1} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.subtitilo}
                value={value}
                onChangeText={onChange}
                secureTextEntry={!show}
                autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShow(!show)}>
                <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={22} color={colors.subtitilo} />
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={colors.iluminado} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                </View>

                {/* Sección foto */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="camera-outline" size={22} color={colors.variante3} />
                        <Text style={styles.cardTitle}>Foto de perfil</Text>
                    </View>

                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            {photoURL ? (
                                <Image source={{ uri: photoURL }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="person" size={52} color={colors.iluminado} />
                                </View>
                            )}
                            {loadingFoto && (
                                <View style={styles.avatarOverlay}>
                                    <ActivityIndicator color={colors.iluminado} size="large" />
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.photoBtn}
                            onPress={handleCambiarFoto}
                            disabled={loadingFoto}
                        >
                            <Ionicons name="cloud-upload-outline" size={18} color={colors.variante2} style={{ marginRight: 6 }} />
                            <Text style={styles.photoBtnText}>
                                {loadingFoto ? 'Subiendo...' : photoURL ? 'Cambiar foto' : 'Subir foto'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.hint}>La imagen se sube a Cloudinary y se guarda en tu perfil</Text>
                    </View>
                </View>

                {/* Sección nombre */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-outline" size={22} color={colors.variante3} />
                        <Text style={styles.cardTitle}>Información personal</Text>
                    </View>

                    <Text style={styles.label}>Nombre completo</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={22} color={colors.variante1} />
                        <TextInput
                            style={styles.input}
                            placeholder="Tu nombre"
                            placeholderTextColor={colors.subtitilo}
                            value={nombre}
                            onChangeText={setNombre}
                            autoCapitalize="words"
                        />
                    </View>

                    <Text style={styles.label}>Correo electrónico</Text>
                    <View style={[styles.inputContainer, styles.inputDisabled]}>
                        <Ionicons name="mail-outline" size={22} color={colors.subtitilo} />
                        <TextInput
                            style={[styles.input, { color: colors.subtitilo }]}
                            value={user?.email || ''}
                            editable={false}
                        />
                        <Ionicons name="lock-closed" size={16} color={colors.subtitilo} />
                    </View>
                    <Text style={styles.hint}>El correo no se puede modificar</Text>

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={guardarNombre}
                        disabled={loadingNombre}
                    >
                        {loadingNombre
                            ? <ActivityIndicator color={colors.iluminado} />
                            : <Text style={styles.saveBtnText}>Guardar nombre</Text>
                        }
                    </TouchableOpacity>
                </View>

                {/* Sección contraseña */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="lock-closed-outline" size={22} color={colors.variante3} />
                        <Text style={styles.cardTitle}>Cambiar contraseña</Text>
                    </View>

                    <Text style={styles.label}>Contraseña actual</Text>
                    {renderPasswordInput("Ingresa tu contraseña actual", passwordActual, setPasswordActual, showPassActual, setShowPassActual)}

                    <Text style={styles.label}>Nueva contraseña</Text>
                    {renderPasswordInput("Mínimo 6 caracteres", passwordNueva, setPasswordNueva, showPassNueva, setShowPassNueva)}

                    <Text style={styles.label}>Confirmar nueva contraseña</Text>
                    {renderPasswordInput("Repite la nueva contraseña", passwordConfirm, setPasswordConfirm, showPassConfirm, setShowPassConfirm)}

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={cambiarPassword}
                        disabled={loadingPassword}
                    >
                        {loadingPassword
                            ? <ActivityIndicator color={colors.iluminado} />
                            : <Text style={styles.saveBtnText}>Cambiar contraseña</Text>
                        }
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.principal },
    header: {
        backgroundColor: colors.variante1, paddingTop: 55, paddingBottom: 20,
        paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center',
    },
    backBtn: { marginRight: 15, padding: 4 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.iluminado },
    card: {
        backgroundColor: colors.iluminado, borderRadius: 20,
        margin: 20, marginBottom: 0, padding: 20, elevation: 3,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    cardTitle: { fontSize: 17, fontWeight: '700', color: colors.oscuro, marginLeft: 10 },
    avatarSection: { alignItems: 'center', paddingVertical: 10 },
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatarImage: {
        width: 100, height: 100, borderRadius: 50,
        borderWidth: 3, borderColor: colors.variante3,
    },
    avatarPlaceholder: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: colors.variante4,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 3, borderColor: colors.variante3,
    },
    avatarOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 50, backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center', alignItems: 'center',
    },
    photoBtn: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: colors.variante3,
        borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20,
        marginBottom: 10,
    },
    photoBtnText: { color: colors.variante2, fontWeight: '600', fontSize: 15 },
    label: { fontSize: 13, fontWeight: '600', color: colors.subtitilo, marginBottom: 8, marginTop: 12 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.principal,
        borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 4,
    },
    inputDisabled: { opacity: 0.6 },
    input: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, fontSize: 15, color: colors.oscuro },
    hint: { fontSize: 12, color: colors.subtitilo, marginTop: 4, textAlign: 'center' },
    saveBtn: {
        backgroundColor: colors.variante3, borderRadius: 14, paddingVertical: 15,
        alignItems: 'center', marginTop: 20, elevation: 3,
    },
    saveBtnText: { color: colors.iluminado, fontWeight: 'bold', fontSize: 16 },
});

export default EditarPerfilScreen;
