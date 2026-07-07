export default function SelectField({
  id,
  label,
  children,
  className = "",
  labelClassName = "visuallyHidden",
  ...props
}) {
  return (
    <div className={`selectField ${className}`.trim()}>
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <div className="selectShell">
        <select id={id} {...props}>
          {children}
        </select>
      </div>
    </div>
  );
}
