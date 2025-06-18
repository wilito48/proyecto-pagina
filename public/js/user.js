export function getToken() {
  return localStorage.getItem("token");
}

export function getProfileImage() {
  return localStorage.getItem("profileImage") || "/imagen/perfil.jpg";
}

export function setProfileImage(url) {
  localStorage.setItem("profileImage", url);
}

export function showUserInfo() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  if (document.getElementById("userInfo")) document.getElementById("userInfo").textContent = username;
  if (document.getElementById("userEmail")) document.getElementById("userEmail").textContent = email;
}

export function updateNavProfilePic() {
  const navProfilePic = document.getElementById("navProfilePic");
  if (navProfilePic) navProfilePic.src = getProfileImage();
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("profileImage");
  window.location.href = "login.html";
} 