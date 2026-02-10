import { TextInput } from "@/components/desing-system/TextInput/TextInput";

export function AddRulesForm() {
	return (
		<form className="flex flex-col gap-8">
			<h2>Notificarme cuando: </h2>
			<TextInput
				type="email"
				label="Correo electronico"
				description="La dirección de correo electrónico a la que se enviarán las alertas de precios"
				name="email"
			/>
			<TextInput
				type="number"
				label="Precio máximo"
				// startIcon={<IconDollarSign />}
				description="Precio máximo que estás dispuesto a pagar."
				name="max_price"
			/>
			<TextInput
				type="number"
				label="Porcentaje de caída"
				// startIcon={<IconPorcent />}
				description="Porcentaje de caída respecto al precio actual."
				name="umbral_porcent"
			/>
			<input type="checkbox" />
		</form>
	);
}
