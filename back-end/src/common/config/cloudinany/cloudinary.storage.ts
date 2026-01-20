	import { CloudinaryStorage } from 'multer-storage-cloudinary';
	import { v2 as Cloudinary } from 'cloudinary';

	export const AvatarStorage = new CloudinaryStorage({
		cloudinary: Cloudinary,
		params: async () => ({
			folder: 'avatars',
			resource_type: 'image',
			public_id: `avatar-${Date.now()}`,
			allowed_formats: ['jpg', 'png', 'jpeg'],
			transformation: [
				{ width: 300, height: 300, crop: 'fill' },
			],
		}),
	});

