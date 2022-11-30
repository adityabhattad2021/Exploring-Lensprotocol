import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { client, getProfile } from "../../api";

function Profile() {
	const router = useRouter();
	const { id } = router.query;
	useEffect(() => {
		if (id) {
			fetchProfile();
		}
	}, [id]);

	async function fetchProfile() {
		const response = await client.query(getProfile(id)).toPromise();
		console.log(response);
	}

	return <div>Building...</div>;
}


export default Profile;