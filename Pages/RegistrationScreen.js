import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Formik } from 'formik';
import * as Yup from 'yup';

const FIELDS = [
    { name: 'shopName', icon: 'home', placeholder: 'Enter your shop name' },
    { name: 'shopOwnerName', icon: 'user', placeholder: 'Enter your shop owner name' },
    { name: 'shopLocation', icon: 'map-marker', placeholder: 'Enter your shop location' },
    { name: 'contactNumber', icon: 'phone', placeholder: 'Enter your contact number' },
    { name: 'products', icon: 'shopping-cart', placeholder: 'Enter product names, one per line', multiline: true },
    { name: 'emailAddress', icon: 'envelope', placeholder: 'Enter your Email address' },
    { name: 'password', icon: 'lock', placeholder: 'Enter your password', secure: true },
    { name: 'confirmPassword', icon: 'lock', placeholder: 'Confirm Password', secure: true }
];

const validationSchema = Yup.object().shape({
    shopName: Yup.string().required('Required'),
    shopOwnerName: Yup.string().required('Required'),
    shopLocation: Yup.string().required('Required'),
    contactNumber: Yup.string().matches(/^[0-9]+$/, 'Only numbers').required('Required'),
    products: Yup.string().test(
        'is-not-empty',
        'At least one product must be entered',
        (value) => value && value.trim().length > 0
    ).required('Required'),
    emailAddress: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too short').required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required')
});

const RegistrationScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Register</Text>
                <TouchableOpacity>
                    <Icon name="bell" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Spices-Link</Text>
                <Text style={styles.subtitle}>Let's help you meet up best experiences.</Text>
                <Formik
                    initialValues={{ ...FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}) }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log(values);
                        navigation.navigate('BuyerLogin');}
                    }
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View>
                            {FIELDS.map(({ name, icon, placeholder, secure, multiline }) => (
                                <View key={name} style={styles.inputContainer}>
                                    <Icon name={icon} size={20} color="#654321" style={styles.icon} />
                                    <TextInput
                                        style={[styles.input, multiline && { height: 80 }]}
                                        placeholder={placeholder}
                                        onChangeText={handleChange(name)}
                                        onBlur={handleBlur(name)}
                                        value={values[name]}
                                        secureTextEntry={secure || false}
                                        autoCorrect={false} 
                                        autoComplete="off"
                                        autoCapitalize="words"
                                        textContentType="none"
                                        multiline={multiline || false}
                                        numberOfLines={multiline ? 4 : 1}
                                    />
                                    {errors[name] && touched[name] && <Text style={styles.error}>{errors[name]}</Text>}
                                </View>
                            ))}
                            
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Register</Text>
                            </TouchableOpacity>
                            <Text style={styles.loginText}>
                                Already have an account? <Text style={styles.loginLink} onPress={() => navigation.navigate("BuyerLogin")}>Sign in</Text>
                            </Text>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </View>
    );
};



const styles = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#4E2A14', padding: 15, marginTop: 20 },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    container: { padding: 10, marginLeft: 10, marginRight: 10 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#654321', marginTop: 10 },
    subtitle: { fontSize: 14, textAlign: 'center', color: '#555', marginBottom: 30 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#F8E5C0', padding: 5, borderRadius: 8 },
    icon: { marginRight: 10, marginLeft: 10 },
    input: { flex: 1, fontSize: 14 },
    error: { color: 'red', fontSize: 11, marginTop: 1, marginLeft: 20 },
    button: { backgroundColor: '#4E2A14', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    loginText: { textAlign: 'center', marginTop: 10, fontSize: 14 },
    loginLink: { color: '#8B4513', fontWeight: 'bold' }
});

export default RegistrationScreen;