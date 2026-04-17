import { useState } from "react";
import colors from "../../constants/colors";
import { StyleSheet, TextInput, View, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebaseService";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setError('');
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Actualizar el perfil del usuario con el nombre
            await updateProfile(user, {
                displayName: name
            });
            
            Alert.alert('Éxito', 'Usuario registrado correctamente', [
                { text: 'OK', onPress: () => navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                }) }
            ]);
        } catch (error) {
            console.error('=== ERROR DE REGISTRO ===');
            console.error('Código de error:', error.code);
            console.error('Mensaje de error:', error.message);
            console.error('Error completo:', error);
            console.error('========================');
            
            let errorMessage = 'Error al registrar usuario';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Ya existe una cuenta con este correo electrónico';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del correo electrónico no es válido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es muy débil';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'El registro no está habilitado en Firebase Console';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                case 'auth/invalid-api-key':
                    errorMessage = 'API Key de Firebase inválida. Verifica tu configuración';
                    break;
                case 'auth/project-not-found':
                    errorMessage = 'Proyecto de Firebase no encontrado';
                    break;
                case 'auth/configuration-not-found':
                    errorMessage = 'Configuración de Firebase no encontrada';
                    break;
                default:
                    errorMessage = `${error.message || 'Error desconocido'} (Código: ${error.code})`;
            }
            
            setError(errorMessage);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <LinearGradient colors={colors.gradientePrimario} style={styles.gradientBackground}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logoContainer}>
                        <Ionicons name="person-add-outline" size={60} color={colors.iluminado} />
                        <Text style={styles.appSubtitle}>Crea tu cuenta</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Registro</Text>
                        
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={24} color={colors.variante1} />
                            <TextInput 
                                style={styles.input} 
                                placeholder="Nombre completo" 
                                placeholderTextColor={colors.subtitilo}
                                value={name} 
                                onChangeText={setName} 
                                autoCapitalize="words" 
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={24} color={colors.variante1} />
                            <TextInput 
                                style={styles.input} 
                                placeholder="Correo electrónico" 
                                placeholderTextColor={colors.subtitilo}
                                value={email} 
                                onChangeText={setEmail} 
                                keyboardType="email-address" 
                                autoCapitalize="none" 
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={24} color={colors.variante1} />
                            <TextInput 
                                style={styles.input} 
                                placeholder="Contraseña" 
                                placeholderTextColor={colors.subtitilo}
                                value={password} 
                                onChangeText={setPassword} 
                                secureTextEntry 
                                autoCapitalize="none" 
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="shield-checkmark-outline" size={24} color={colors.variante1} />
                            <TextInput 
                                style={styles.input} 
                                placeholder="Confirmar contraseña" 
                                placeholderTextColor={colors.subtitilo}
                                value={confirmPassword} 
                                onChangeText={setConfirmPassword} 
                                secureTextEntry 
                                autoCapitalize="none" 
                            />
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Registrarse</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.textNormal}>¿Ya tienes cuenta? </Text>
                            <Text style={styles.linkText}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    appSubtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.iluminado,
        marginTop: 10,
        letterSpacing: 1,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.iluminado,
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.oscuro,
        marginBottom: 25,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.principal,
        borderRadius: 15,
        marginBottom: 15,
        paddingHorizontal: 15,
        width: '100%',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    input: {
        flex: 1,
        paddingVertical: 18,
        paddingHorizontal: 12,
        color: colors.oscuro,
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: colors.variante3,
        paddingVertical: 18,
        borderRadius: 15,
        marginTop: 15,
        marginBottom: 25,
        width: '100%',
        alignItems: 'center',
        shadowColor: colors.variante3,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: colors.iluminado,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textNormal: {
        color: colors.subtitilo,
        fontSize: 15,
    },
    linkText: {
        color: colors.variante2,
        fontSize: 15,
        fontWeight: 'bold',
    },
    errorText: {
        color: colors.alerta,
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        width: '100%',
    },
});

export default RegisterScreen;