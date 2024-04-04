
        {progress ? (
          <LoadingScreen />
        ) : (
          <View style={styles.container}>
            <View style={styles.Middle}>
              <Text style={styles.LoginText}>Signup</Text>
            </View>
            <View style={styles.text2}>
              <Text>Already have account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signupText}> Login </Text>
              </TouchableOpacity>
            </View>

            {isOtpSent ? (
              <View>
                <View style={styles.buttonStyleX}>
                  <View style={styles.emailInput}>
                    <Input
                      variant="outline"
                      placeholder="Enter OTP"
                      _light={{
                        placeholderTextColor: "blueGray.400",
                      }}
                      _dark={{
                        placeholderTextColor: "blueGray.50",
                      }}
                      onChangeText={(text) => {
                        // Handle OTP input
                        setOtp(text);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.buttonStyle}>
                  <Button style={styles.buttonDesign} onPress={verifyOtp}>
                    VERIFY OTP
                  </Button>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.buttonContainer}>
                  {/* First Name  Input Field */}
                  <View style={styles.buttonStyle}>
                    <View style={styles.emailInput}>
                      <Input
                        InputLeftElement={
                          <Icon
                            as={<FontAwesome5 name="user-secret" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        variant="outline"
                        placeholder="First Name"
                        _light={{
                          placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                          placeholderTextColor: "blueGray.50",
                        }}
                        onChangeText={(text) => setFirstName(text)}
                      />
                    </View>
                  </View>

                  {/* Last Name  Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Input
                        InputLeftElement={
                          <Icon
                            as={<FontAwesome5 name="envelope" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        variant="outline"
                        placeholder="Last Name"
                        _light={{
                          placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                          placeholderTextColor: "blueGray.50",
                        }}
                        onChangeText={(text) => {
                          setLastName(text);
                        }}
                      />
                    </View>
                  </View>

                  {/* Email Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Input
                        InputLeftElement={
                          <Icon
                            as={<FontAwesome5 name="envelope" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        variant="outline"
                        placeholder="Email"
                        _light={{
                          placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                          placeholderTextColor: "blueGray.50",
                        }}
                        onChangeText={(text) => {
                          setEmail(text);
                          setEmailError(""); // Clear the validation error when the user starts typing
                        }}
                      />
                    </View>
                  </View>
                  {emailError !== "" && (
                    <Text style={styles.errorText}>{emailError}</Text>
                  )}

                  {/* Phone Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Input
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="phone" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        variant="outline"
                        placeholder="Phone Number"
                        _light={{
                          placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                          placeholderTextColor: "blueGray.50",
                        }}
                        onChangeText={(text) => {
                          setPhoneNumber(text);
                          setPhoneNumberError(""); // Clear the validation error when the user starts typing
                        }}
                      />
                    </View>
                  </View>
                  {phoneNumberError !== "" && (
                    <Text style={styles.errorText}>{phoneNumberError}</Text>
                  )}

                  {/* Age Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Input
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="phone" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        variant="outline"
                        placeholder="Age"
                        _light={{
                          placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                          placeholderTextColor: "blueGray.50",
                        }}
                        onChangeText={(text) => {
                          setAge(text);
                        }}
                      />
                    </View>
                  </View>

                  {/* Gender Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Select
                        InputLeftElement={
                          <Icon
                            as={<FontAwesome5 name="venus-mars" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        selectedValue={selectedGender}
                        onValueChange={(itemValue) =>
                          setSelectedGender(itemValue)
                        }
                        variant="outline"
                        placeholder="Select Gender"
                      >
                        <Select.Item label="Male" value="male" />
                        <Select.Item label="Female" value="female" />
                        <Select.Item label="Other" value="other" />
                      </Select>
                    </View>
                  </View>

                  {/* Address Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Input
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="phone" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        variant="outline"
                        placeholder="Address"
                        _light={{
                          placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                          placeholderTextColor: "blueGray.50",
                        }}
                        onChangeText={(text) => {
                          setAddress(text);
                        }}
                      />
                    </View>
                  </View>

                  {/* City Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Input
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="phone" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        variant="outline"
                        placeholder="City"
                        _light={{
                          placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                          placeholderTextColor: "blueGray.50",
                        }}
                        onChangeText={(text) => {
                          setCity(text);
                        }}
                      />
                    </View>
                  </View>

                  {/* State Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Input
                        InputLeftElement={
                          <Icon
                            as={<MaterialCommunityIcons name="phone" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        variant="outline"
                        placeholder="State"
                        _light={{
                          placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                          placeholderTextColor: "blueGray.50",
                        }}
                        onChangeText={(text) => {
                          setState(text);
                        }}
                      />
                    </View>
                  </View>

                  {/*  Input Field */}
                  <View style={styles.buttonStyleX}>
                    <View style={styles.emailInput}>
                      <Select
                        InputLeftElement={
                          <Icon
                            as={<FontAwesome5 name="venus-mars" />}
                            size="sm"
                            m={2}
                            _light={{
                              color: "black",
                            }}
                            _dark={{
                              color: "gray.300",
                            }}
                          />
                        }
                        selectedValue={selectedRole}
                        onValueChange={(itemValue) =>
                          handleSelectedRole(itemValue)
                        }
                        variant="outline"
                        placeholder="Select Role"
                      >
                        <Select.Item label="Worker" value="worker" />
                        <Select.Item label="User" value="user" />
                      </Select>
                    </View>
                  </View>
                </View>
                <View style={styles.buttonStyle}>
                  <Button style={styles.buttonDesign} onPress={handleSignUp}>
                    REGISTER NOW
                  </Button>
                </View>
              </View>
            )}

            <StatusBar style="auto" />
          </View>
        )}