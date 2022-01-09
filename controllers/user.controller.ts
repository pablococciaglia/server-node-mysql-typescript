import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.findAll();
		res.status(200).json({ users });
	} catch (error) {
		res.status(500).send(error);
	}
};

export const getUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const user = await User.findByPk(id);
		if (user) {
			res.status(200).json({ user });
		} else {
			res.status(404).json({
				msg: `User id: ${id} not found`,
			});
		}
	} catch (error) {
		res.status(500).send(error);
	}
};

export const createUser = async (req: Request, res: Response) => {
	const { body } = req;

	try {
		const emailExist = await User.findOne({
			where: {
				email: body.email,
			},
		});
		if (emailExist) {
			return res.status(400).json({
				msg: `User with email: ${body.email} already exist`,
			});
		}
		const user: any = User.build(body);
		await user.save();
		res.status(201).json({
			user,
		});
	} catch (error) {
		res.status(500).send(error);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	const { body } = req;
	const { id } = req.params;

	try {
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({
				msg: `User id: ${id} does not exist`,
			});
		}

		await user.update(body);
		res.status(201).json({
			user,
		});
	} catch (error) {
		res.status(500).send(error);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({
				msg: `User id: ${id} does not exist`,
			});
		}
		// Phisic delete
		// await user.destroy();

		// Logic delete
		await user.update({ state: false });

		res.status(200).json({
			msg: `User id: ${id} was deleted`,
		});
	} catch (error) {
		res.status(500).send(error);
	}
};
