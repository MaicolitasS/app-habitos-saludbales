import colors from "../../constants/colors";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseService";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    // Verificar que auth está definido
    console.log('Auth en Login:', auth);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setError('');
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            Alert.alert('Éxito', 'Inicio de sesión exitoso', [
                { text: 'OK', onPress: () => navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                }) }
            ]);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            
            let errorMessage = 'Error al iniciar sesión';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este correo electrónico';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del correo electrónico no es válido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de connection. Verifica tu internet';
                    break;
                default:
                    errorMessage = error.message || 'Error desconocido';
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
                
                <View style={styles.logoContainer}>
                    <Ionicons name="leaf" size={80} color={colors.iluminado} />
                    <Text style={styles.appSubtitle}>Hábitos Saludables</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Bienvenido de nuevo</Text>
                    
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

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.textNormal}>¿No tienes cuenta? </Text>
                        <Text style={styles.linkText}>Regístrate aquí</Text>
                    </TouchableOpacity>
                </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
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
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.principal,
        borderRadius: 15,
        marginBottom: 20,
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
    loginButton: {
        backgroundColor: colors.variante3,
        paddingVertical: 18,
        borderRadius: 15,
        marginTop: 10,
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

export default LoginScreen;