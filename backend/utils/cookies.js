export function setRefreshTokenCookie(res, refreshToken) {
	if (!refreshToken) return;
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Lax",
		maxAge: 30 * 24 * 60 * 60 * 1000, 
	});
}


