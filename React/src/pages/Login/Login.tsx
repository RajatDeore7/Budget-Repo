import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleNotch,
    faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "@/constants/RoutePath.constant.ts";
import styled from "styled-components";

export const Page = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    gap: 36px;
    align-items: center;
`;

export const Container = styled.div`
    background-image: url("/images/backgrounds/login.jpg");
    align-items: center;
    background-repeat: no-repeat;
    background-size: 1200px 600px;
    height: 600px;
    width: 1200px;
    @media (max-width: 768px) {
        height: 100vh;
        width: 100vw;
        background-size: 100vw 100vh;
        background-image: linear-gradient(to bottom, #7dfc7d 0%, #001f00 100%);
        margin: auto 0;
    }
`;

export const FormContainer = styled.div`
    width: 50%;
    height: 80%;
    background-color: rgba(255, 255, 255, 0.9);
    margin: 32px;
    padding: 64px 32px;
    color: black;
    @media (max-width: 768px) {
        height: auto;
        width: auto;
        padding: 12px;
        margin: 40px 0;
        background-color: rgba(255, 255, 255, 0);
        color: white;
    }
`;

export const LoginButton = styled(Button)`
    width: 200px;
    background-color: #009800;
    border: none;
    :hover {
        background-color: #03ba03;
    }
    @media (max-width: 768px) {
        width: 100%;
        background-color: white;
        color: #013201;
        :hover {
            background-color: white;
        }
    }
`;

export const Text = styled.div`
    margin-top: 64px;
    text-align: center;
    font-weight: bold;
    @media (max-width: 768px) {
        margin-top: 16px;
        color: white;
    }
`;

export const MobileImg = styled.img`
    width: 100vw;
    @media (min-width: 768px) {
        display: none;
    }
`;

export const StyledLink = styled(Link)`
    color: #4848e7;
    :visited {
        color: #48057c;
    }
    @media (max-width: 768px) {
        color: white;
        :visited {
            color: #ffffff;
        }
    }
`;

export const Span = styled.span`
    font-weight: bold;
`;

export const Login = () => {
    const [error, setError] = useState<any>(null);
    const [logging, setLogging] = useState<boolean>(false);
    const auth = useAuth();
    const submit = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLogging(true);
        const data = {
            username: e.target.username.value,
            password: e.target.password.value,
        };
        try {
            await auth.login(data);
        } catch (e) {
            setError(e);
        } finally {
            setLogging(false);
        }
    };
    return (
        <Page>
            <Container>
                <MobileImg src="images/backgrounds/login.jpg" />
                <FormContainer>
                    <form
                        className="tw-flex tw-flex-col tw-gap-4 h-1200"
                        onSubmit={submit}
                    >
                        <div>
                            <Form.Label htmlFor="username">
                                <Span>Sign in with Username</Span>
                                <span className="tw-text-red-500">*</span>
                            </Form.Label>
                            <Form.Control
                                id="username"
                                type="text"
                                placeholder="Username"
                                required
                            ></Form.Control>
                        </div>
                        <div>
                            <Form.Label htmlFor="password">
                                <Span>Password</Span>
                                <span className="tw-text-red-500">*</span>
                            </Form.Label>
                            <Form.Control
                                id="password"
                                type="password"
                                placeholder="Password"
                                required
                            ></Form.Control>
                        </div>
                        <div
                            className="tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded tw-relative"
                            role="alert"
                            hidden={!error}
                        >
                            <span className="tw-block sm:tw-inline">
                                Username or Password does not valid!
                            </span>
                        </div>
                        <div className="tw-flex tw-justify-end">
                            <LoginButton type="submit" disabled={logging}>
                                {logging ? (
                                    <FontAwesomeIcon
                                        icon={faCircleNotch}
                                        className="tw-mr-2 fa-spin"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faRightToBracket}
                                        className="tw-mr-2"
                                    />
                                )}
                                Login
                            </LoginButton>
                        </div>
                    </form>
                    <Text>
                        <StyledLink to={`/${ROUTE_PATH.FORGOT_PASSWORD}`}>
                            Forgot password?
                        </StyledLink>
                        <div className="tw-mt-8 ">
                            If you don't have account
                            <StyledLink
                                to={`/${ROUTE_PATH.REGISTER}`}
                                style={{ marginLeft: "8px" }}
                            >
                                Register now
                            </StyledLink>
                        </div>
                    </Text>
                </FormContainer>
            </Container>
        </Page>
    );
};
