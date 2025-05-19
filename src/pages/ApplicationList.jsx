useEffect(() => {
  axios
    .get("http://localhost:3000/api/applications/shelter", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setApplications(res.data));
}, []);
