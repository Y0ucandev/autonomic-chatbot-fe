import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import AuthContext, { AuthProvider } from "../../context/AuthContext";
import { useContext } from "react";
import "@testing-library/jest-dom/vitest";
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        store
    };
})();

const windowLocationMock = {
    href: ""
};

const TestComponent = () => {
    const { user, logout, isAuthenticated, loading } = useContext(AuthContext);

    return (
        <div>
            {loading ? (
                <div data-testid="loading">Ładowanie...</div>
            ) : (
                <>
                    <div data-testid="authenticated">{isAuthenticated ? "Uwierzytelniony" : "Nieuwierzytelniony"}</div>
                    {user && (
                        <div>
                            <div data-testid="user-id">{user.id}</div>
                            <div data-testid="user-name">{user.name}</div>
                            <div data-testid="user-email">{user.email}</div>
                            <div data-testid="user-role">{user.role}</div>
                        </div>
                    )}
                    <button
                        data-testid="logout-button"
                        onClick={logout}
                    >
                        Wyloguj
                    </button>
                </>
            )}
        </div>
    );
};
const renderWithAuthProvider = () => {
    return render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );
};
describe("AuthContext", () => {
    beforeEach(() => {
        Object.defineProperty(window, "localStorage", { value: localStorageMock });
        Object.defineProperty(window, "location", { value: windowLocationMock, writable: true });
        vi.clearAllMocks();
        localStorageMock.clear();
        windowLocationMock.href = "";
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it("powinien inicjalizować się z domyślnym użytkownikiem deweloperskim w środowisku nieprodukcyjnym", async () => {
        renderWithAuthProvider();
        await waitFor(() => {
            const element = screen.getByTestId("authenticated");
            expect(element).toBeDefined();
            expect(element.textContent).toBe("Uwierzytelniony");
        });
        expect(screen.getByTestId("user-id").textContent).toBe("1");
        expect(screen.getByTestId("user-name").textContent).toBe("user");
        expect(screen.getByTestId("user-email").textContent).toBe("user@ft.pl");
        expect(screen.getByTestId("user-role").textContent).toBe("fake-dev-token-123");
    });
    it("powinien sprawdzać token autoryzacyjny i pobierać dane użytkownika przy montowaniu", async () => {
        localStorageMock.getItem.mockReturnValueOnce("test-token");
        globalThis.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                id: "123",
                name: "Testowy Użytkownik",
                email: "test@example.com",
                role: "user"
            })
        }) as any;
        renderWithAuthProvider();
        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith("https://url:/users/me", {
                headers: {
                    "Authorization": "Bearer test-token"
                }
            });
        });
        expect(screen.getByTestId("user-id").textContent).toBe("123");
        expect(screen.getByTestId("user-name").textContent).toBe("Testowy Użytkownik");
        expect(screen.getByTestId("user-email").textContent).toBe("test@example.com");
        expect(screen.getByTestId("user-role").textContent).toBe("user");
    });
    it("powinien poprawnie wylogować użytkownika", async () => {
        renderWithAuthProvider();
        await waitFor(() => {
            const element = screen.getByTestId("authenticated");
            expect(element).toBeDefined();
            expect(element.textContent).toBe("Uwierzytelniony");
        });
        await act(async () => {
            const logoutButton = screen.getByTestId("logout-button");
            logoutButton.click();
        });
        expect(localStorageMock.removeItem).toHaveBeenCalledWith("accessToken");
        expect(windowLocationMock.href).toBe("/Logowanie");
    });
});