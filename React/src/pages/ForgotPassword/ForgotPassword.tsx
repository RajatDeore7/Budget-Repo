import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleNotch,
    faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import { ROUTE_PATH } from "@/constants/RoutePath.constant";
import { useNavigate } from "react-router-dom";
import { Container, FormContainer, MobileImg, Page } from "../Login/Login";
import { Label } from "../Register/Register";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<any>(null);
    const [logging, setLogging] = useState<boolean>(false);
    const auth = useAuth();

    const submit = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLogging(true);
        const data = {
            email: e.target.email.value,
        };
        try {
            await auth.resetPassword(data);
            toast("Successfully! Please check email ");
            navigate(`/${ROUTE_PATH.LOGIN}`);
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
                    <Label>Forget Password</Label>

                    <form
                        className="tw-flex tw-flex-col tw-gap-4"
                        onSubmit={submit}
                    >
                        <div>
                            <Form.Label htmlFor="username">
                                Email<span className="tw-text-red-500">*</span>
                            </Form.Label>
                            <Form.Control
                                id="email"
                                type="text"
                                required
                            ></Form.Control>
                        </div>
                        <div
                            className="tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded tw-relative"
                            role="alert"
                            hidden={!error}
                        >
                            <span className="tw-block sm:tw-inline">
                                Email does not valid!
                            </span>
                        </div>
                        <div className="tw-flex tw-justify-end">
                            <Button
                                type="submit"
                                disabled={logging}
                                variant="success"
                                className="tw-bg-darkGreen"
                            >
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
                                Reset
                            </Button>
                        </div>
                    </form>
                </FormContainer>
            </Container>
        </Page>
    );
};
