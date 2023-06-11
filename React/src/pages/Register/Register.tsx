import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { values } from "lodash";
import { ROUTE_PATH } from "@/constants/RoutePath.constant.ts";
import {
    Container,
    FormContainer,
    MobileImg,
    Page,
    Span,
    StyledLink,
} from "../Login/Login";
import styled from "styled-components";

const RegisterContainer = styled(Container)`
    background-color: red;
    width: 1000px;
    @media (max-width: 768px) {
        height: auto;
        width: 100vw;
        background-size: auto auto;
        background-image: linear-gradient(to bottom, #7dfc7d 0%, #001f00 100%);
    }
`;

const ShineMobile = styled.img`
    height: 600px;
    width: 400px;
    @media (max-width: 768px) {
        display: none;
    }
`;

const RegisterFormContainer = styled(FormContainer)`
    padding: 16px 32px;
`;

export const Label = styled.div`
    width: 100%;
    background-color: white;
    padding: 8px;
    border: none;
    border-radius: 4px;
    text-align: center;
    font-weight: bold;
    font-size: larger;
    margin-bottom: 16px;
    @media (max-width: 768px) {
        background-color: #0a4a02;
        color: white;
    }
`;

export const Register = () => {
    const navigate = useNavigate();
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
            first_name: e.target.firstName.value,
            last_name: e.target.lastName.value,
            email: e.target.email.value,
            gender: e.target.gender.value,
            city: e.target.city.value,
            country: e.target.country.value,
        };
        try {
            await auth.register(data);
            toast("Successfully!");
            navigate(`/${ROUTE_PATH.LOGIN}`);
        } catch (e) {
            setError(e);
        } finally {
            setLogging(false);
        }
    };
    return (
        <Page>
            <ShineMobile src="images/budget.png" />
            <RegisterContainer>
                <MobileImg src="images/backgrounds/login.jpg" />

                <RegisterFormContainer>
                    <Label>Register</Label>
                    <form onSubmit={submit}>
                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                            <div>
                                <Form.Label htmlFor="username">
                                    <Span>Username</Span>
                                    <span className="tw-text-red-500">*</span>
                                </Form.Label>
                                <Form.Control
                                    id="username"
                                    type="text"
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
                                    required
                                ></Form.Control>
                            </div>
                            <div>
                                <Form.Label htmlFor="firstName">
                                    <Span>First name</Span>
                                    <span className="tw-text-red-500">*</span>
                                </Form.Label>
                                <Form.Control
                                    id="firstName"
                                    type="text"
                                    required
                                ></Form.Control>
                            </div>
                            <div>
                                <Form.Label htmlFor="lastName">
                                    <Span>Last name</Span>
                                    <span className="tw-text-red-500">*</span>
                                </Form.Label>
                                <Form.Control
                                    id="lastName"
                                    type="text"
                                    required
                                ></Form.Control>
                            </div>
                            <div>
                                <Form.Label htmlFor="email">
                                    <Span>Email</Span>
                                    <span className="tw-text-red-500">*</span>
                                </Form.Label>
                                <Form.Control
                                    id="email"
                                    type="email"
                                    required
                                ></Form.Control>
                            </div>
                            <div>
                                <Form.Label htmlFor="gender">
                                    <Span>Gender</Span>
                                    <span className="tw-text-red-500">*</span>
                                </Form.Label>
                                <Form.Select
                                    id="gender"
                                    required={true}
                                    className="form-select form-control"
                                >
                                    <option value={1}>Male</option>
                                    <option value={2}>Female</option>
                                    <option value={3}>Other</option>
                                </Form.Select>
                            </div>
                            <div>
                                <Form.Label htmlFor="city">
                                    <Span>City</Span>
                                    <span className="tw-text-red-500">*</span>
                                </Form.Label>
                                <Form.Control
                                    id="city"
                                    type="text"
                                    required
                                ></Form.Control>
                            </div>
                            <div>
                                <Form.Label htmlFor="country">
                                    <Span>Country</Span>
                                    <span className="tw-text-red-500">*</span>
                                </Form.Label>
                                <Form.Control
                                    id="country"
                                    type="text"
                                    required
                                ></Form.Control>
                            </div>
                        </div>
                        <div
                            className="tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded tw-relative tw-mt-5"
                            role="alert"
                            hidden={!error}
                        >
                            <span className="tw-block sm:tw-inline">
                                {values(error?.response?.data)?.[0]?.[0]}
                            </span>
                        </div>
                        <div className="tw-flex tw-items-center tw-justify-between tw-mt-4">
                            <StyledLink
                                className="tw-text-blue-600 visited:tw-text-purple-600"
                                to={`/${ROUTE_PATH.LOGIN}`}
                            >
                                <Span>You have account already?</Span>
                            </StyledLink>
                            <Button
                                type="submit"
                                variant="success"
                                disabled={logging}
                                className="!tw-flex tw-items-center tw-justify-center"
                            >
                                {logging ? (
                                    <FontAwesomeIcon
                                        icon={faCircleNotch}
                                        className="tw-mr-2 fa-spin"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined tw-mr-2">
                                        app_registration
                                    </span>
                                )}
                                Register
                            </Button>
                        </div>
                    </form>
                </RegisterFormContainer>
            </RegisterContainer>
        </Page>
    );
};
